import type {
  NetworkInfoConnection,
  NetworkStatusInfoTracker,
  NetworkStatusConfig,
  OnStatusChange,
  NetworkConstructorConfig,
  NetworkItemListTracker,
} from "./NetworkStatusTracker.types";

export class NetworkStatusTracker {
  private networkInfo: NetworkStatusInfoTracker;

  private listUrls: string[] = [];
  private state = {
    isActiveEvents: false,
    isMonitoring: false,
    checkIntervalId: null as number | null,
    isInitialized: false,
  };
  private setState(payload: Partial<typeof this.state>) {
    this.state = { ...this.state, ...payload };
  }
  private getState() {
    return this.state;
  }

  constructor(listUrls: string[] = []) {
    this.listUrls = listUrls;
    this.networkInfo = {
      isNetwork: false,
      typeNetwork: "unknown",
    };
  }

  private getConnection(): NetworkInfoConnection | null {
    return (window.navigator as any)?.connection || null;
  }
  // private getIsNetwork = (typeNetwork: string) => !["unknown", "none"].includes(typeNetwork);
  private getTypeNetwork = (isOnlineFetch: boolean): string => {
    if (isOnlineFetch === false) return "none";
    const connection = this.getConnection();
    if (connection) {
      return connection?.effectiveType || connection?.type || "unknown";
    }

    return "4g";
  };

  private updateState(isOnlineFetch: boolean, onStatusChange?: OnStatusChange) {
    const info: NetworkStatusInfoTracker = {
      isNetwork: isOnlineFetch,
      typeNetwork: this.getTypeNetwork(isOnlineFetch),
    };

    this.networkInfo = info;
    if (typeof onStatusChange === "function") {
      onStatusChange(info);
    }
  }

  /*-----------------------------------------------------------------------------*/
  private controllersEvents = {
    online: null as null | AbortController,
    offline: null as null | AbortController,
    change: null as null | AbortController,
  };

  private getControllersEvents() {
    return this.controllersEvents;
  }
  private setControllersEvents(payload: typeof this.controllersEvents) {
    this.controllersEvents = { ...this.controllersEvents, ...payload };
  }

  private async initialize(onStatusChange?: OnStatusChange, config?: NetworkConstructorConfig): Promise<void> {
    if (this.state.isInitialized) return;
    try {
      // Сначала проверяем через события браузера/Cordova
      const initialOnline = typeof navigator !== "undefined" ? navigator.onLine : false;

      // Если есть URL для проверки, делаем реальный запрос
      if (this.listUrls.length > 0) {
        await this.requestByUrls(onStatusChange, config);
      } else {
        // Если нет URL, используем информацию из браузера
        this.updateState(initialOnline, onStatusChange);
      }

      this.setState({ isInitialized: true });
    } catch (error) {
      console.error("NetworkStatusTracker initialization error:", error);
      this.updateState(false, onStatusChange);
      this.setState({ isInitialized: true });
    }
  }

  async startEvents(onStatusChange: OnStatusChange) {
    return new Promise<void>((resolve, reject) => {
      const { isActiveEvents } = this.getState();
      if (isActiveEvents) {
        resolve();
      }

      // Инициализируем перед началом событий
      this.initialize(onStatusChange).then(() => {
        this.setState({ isActiveEvents: true });

        const controllers = {
          online: new AbortController(),
          offline: new AbortController(),
          change: new AbortController(),
        };
        this.setControllersEvents(controllers);

        const connection = this.getConnection();

        if (connection && connection?.addEventListener) {
          connection.addEventListener(
            "change",
            (e) => {
              console.log("NetworkStatusTracker: connection change event");
              const isNetwork = navigator.onLine;
              this.updateState(isNetwork, onStatusChange);
            },
            { signal: controllers.change?.signal },
          );
        } else {
          window.addEventListener(
            "online",
            () => {
              this.updateState(true, onStatusChange);
            },
            { signal: controllers.online?.signal },
          );

          window.addEventListener(
            "offline",
            () => {
              this.updateState(false, onStatusChange);
            },
            { signal: controllers.offline?.signal },
          );
        }

        resolve();
      });
    });
  }

  stopEvents() {
    const { isActiveEvents } = this.getState();
    if (isActiveEvents) {
      this.setState({ isActiveEvents: false });
      const controllers = this.getControllersEvents();
      for (const item of Object.values(controllers)) {
        item?.abort();
      }
      this.setControllersEvents({
        online: null,
        offline: null,
        change: null,
      });
    }
  }
  /*-----------------------------------------------------------------------------*/

  private async requestByUrls(onStatusChange?: OnStatusChange, config?: NetworkConstructorConfig): Promise<void> {
    try {
      const isOnline = await this.checkConnection(config);
      this.updateState(isOnline, onStatusChange);
    } catch (error) {
      console.error("NetworkStatusTracker: requestByUrls error:", error);
      this.updateState(false, onStatusChange);
    }
  }

  private async checkConnection(config: NetworkConstructorConfig = {}): Promise<boolean> {
    for (const url of this.listUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config?.timeout || 5000);

        const response = await window.fetch(url, {
          method: "HEAD",
          mode: "no-cors",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        return true;
      } catch (err) {
        continue;
      }
    }
    return false;
  }

  private controllersFetching = {
    online: null as null | AbortController,
    offline: null as null | AbortController,
    change: null as null | AbortController,
  };
  private getControllersMonitoring() {
    return this.controllersFetching;
  }
  private setControllersMonitoring(payload: typeof this.controllersFetching) {
    this.controllersFetching = { ...this.controllersFetching, ...payload };
  }

  private startFetching(onStatusChange: OnStatusChange, { interval = 5000 }: NetworkStatusConfig) {
    const { isMonitoring } = this.getState();
    if (isMonitoring) {
      return;
    }

    this.setState({ isMonitoring: true });
    const controllers = {
      online: new AbortController(),
      offline: new AbortController(),
      change: new AbortController(),
    };
    this.setControllersMonitoring(controllers);

    //INFO: Сделать запрос в интернет что бы понять есть ли сеть
    this.requestByUrls(onStatusChange, { timeout: 2000 });

    const checkIntervalId = window.setInterval(() => this.requestByUrls(onStatusChange), interval);
    this.setState({ checkIntervalId });
  }

  stopFetching() {
    const { isMonitoring, checkIntervalId } = this.getState();
    if (!isMonitoring) return;

    const controllers = this.getControllersMonitoring();
    for (const item of Object.values(controllers)) {
      item?.abort();
    }

    if (checkIntervalId) {
      clearInterval(checkIntervalId);
    }
    this.setState({ isMonitoring: false, checkIntervalId: null });
  }

  /*--------------------------------------------------------------------------------------------------*/
  /*--------------------------------------------------------------------------------------------------*/

  async checkStatus(onStatusChange?: OnStatusChange, config?: NetworkConstructorConfig): Promise<NetworkStatusInfoTracker> {
    await this.requestByUrls(onStatusChange);
    return this.getCurrentState();
  }

  fetchingNetwork(onStatusChange: OnStatusChange, config: Required<NetworkStatusConfig>) {
    this.startFetching(onStatusChange, config);
    return {
      stop: () => this.stopFetching(),
    };
  }

  getCurrentState() {
    return this.networkInfo;
  }
  destroy() {
    this.stopEvents();
    this.stopFetching();
    this.setState({
      isActiveEvents: false,
      isMonitoring: false,
      isInitialized: false,
    });
  }
}
