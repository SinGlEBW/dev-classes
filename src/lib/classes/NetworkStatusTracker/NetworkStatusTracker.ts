import type { NetworkInfoConnection, NetworkStatusInfoTracker, NetworkStatusConfig, OnStatusChange, NetworkConstructorConfig, NetworkItemListTracker } from './NetworkStatusTracker.types';




export class NetworkStatusTracker {
  private networkInfo: NetworkStatusInfoTracker;

  private listUrls:string[] = []
  private state = {
    isActiveEvents: false,
    isMonitoring: false,
    checkIntervalId: null as number | null
  }
 
  private setState(payload: Partial<typeof this.state>) {
    this.state = {...this.state, ...payload};
  }
  private getState() { return this.state; }

  constructor(listUrls:string[]) { 
    this.listUrls = listUrls;
    

    const isNetwork = typeof navigator !== 'undefined' ? navigator.onLine : false;
    this.networkInfo = {
      isNetwork,
      typeNetwork: this.getTypeNetwork(this.getConnection(), isNetwork)
    };
  }

  private getConnection():any { return (window as any)?.navigator?.connection; }


  private getIsNetwork = (typeNetwork:string) => !['unknown', 'none'].includes(typeNetwork);
  private getTypeNetwork = (props: NetworkInfoConnection, isOnlineFetch: boolean | null) => {
 
      //  isOnlineFetch || isOnlineFetch === null ? effectiveType || type || "none" : "none"
    return isOnlineFetch || isOnlineFetch === null ? "4g" : "none"
  }

  private updateState(isOnlineFetch: boolean, onStatusChange?: OnStatusChange): void {
    const info:NetworkStatusInfoTracker = {
      isNetwork: isOnlineFetch,
      typeNetwork: this.getTypeNetwork(this.getConnection(), isOnlineFetch)
    }

    this.networkInfo = info;
    if (typeof onStatusChange === 'function') { onStatusChange(info); }
  }


  /*-----------------------------------------------------------------------------*/
  private controllersEvents = {
    online: null as null | AbortController,
    offline: null as null | AbortController,
    change: null as null | AbortController,
  }
  private getControllersEvents() { return this.controllersEvents; }
  private setControllersEvents(payload: typeof this.controllersEvents) { this.controllersEvents = { ...this.controllersEvents, ...payload }; }

  startEvents(onStatusChange: OnStatusChange) {
    const { isActiveEvents } = this.getState();
    if(isActiveEvents) { return }

    this.setState({isActiveEvents: true});
    const controllers = {
      online: new AbortController(),
      offline: new AbortController(),
      change: new AbortController(),
    }
    this.setControllersEvents(controllers);
    
    
    const connection = this.getConnection();
    const typeNetwork = this.getTypeNetwork(connection, window.navigator.onLine);
    const isNetwork = this.getIsNetwork(typeNetwork);

    this.updateState(isNetwork, onStatusChange);


    window.addEventListener('online', () => { this.updateState(true, onStatusChange)}, {signal: controllers.online?.signal});
    window.addEventListener('offline', () => { this.updateState(false, onStatusChange) }, {signal: controllers.offline?.signal});

    if (this.getConnection()?.addEventListener) {
      this.getConnection().addEventListener('change', () => {

        const connection = this.getConnection();
        const typeNetwork = this.getTypeNetwork(connection, null);
        const isNetwork = this.getIsNetwork(typeNetwork);
        this.updateState(isNetwork, onStatusChange)

      }, {signal: controllers.change?.signal});
    }

  }
  stopEvents(){
    const { isActiveEvents } = this.getState();
    if(isActiveEvents) {
      this.setState({isActiveEvents: false});
      const controllers = this.getControllersEvents();
      for(const item of Object.values(controllers)){ item?.abort() }
    }
  }


  /*-----------------------------------------------------------------------------*/

  private async requestByUrls (onStatusChange?: OnStatusChange, config?: NetworkConstructorConfig): Promise<void> {
    const isOnline = await this.checkConnection(config);
    this.updateState(isOnline, onStatusChange);
  };

  private async checkConnection(config: NetworkConstructorConfig = {}): Promise<boolean> {
    for (const url of this.listUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config?.timeout || 5000);
        
        const response = await window.fetch(url);
        
        clearTimeout(timeoutId);
        if (response.status >= 200 && response.status < 400) { return true; }
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
  }
  private getControllersMonitoring() { return this.controllersFetching; }
  private setControllersMonitoring(payload: typeof this.controllersFetching) { this.controllersFetching = { ...this.controllersFetching, ...payload }; }


  private startFetching(onStatusChange: OnStatusChange, {interval = 5000}: NetworkStatusConfig) {
    
    const { isMonitoring } = this.getState();
    if (isMonitoring) { return }

    this.setState({isMonitoring: true});
    const controllers = {
      online: new AbortController(),
      offline: new AbortController(),
      change: new AbortController(),
    }
    this.setControllersMonitoring(controllers);



    //INFO: Сделать запрос в интернет что бы понять есть ли сеть
    this.requestByUrls(onStatusChange, {timeout: 2000});

    const checkIntervalId = window.setInterval(() => this.requestByUrls(onStatusChange), interval );
    this.setState({checkIntervalId});

  }


  stopFetching(){
    const { isMonitoring, checkIntervalId } = this.getState();
    if (!isMonitoring) return;

    const controllers = this.getControllersMonitoring();
    for(const item of Object.values(controllers)){ item?.abort() }

    if (checkIntervalId) { clearInterval(checkIntervalId); }
    this.setState({isMonitoring: false, checkIntervalId: null});
  }

  /*--------------------------------------------------------------------------------------------------*/
  /*--------------------------------------------------------------------------------------------------*/

  async checkStatus(onStatusChange?: OnStatusChange, config?: NetworkConstructorConfig): Promise<NetworkStatusInfoTracker> {
    await this.requestByUrls(onStatusChange);
    return this.getCurrentState();
  }

  fetchingNetwork(onStatusChange: OnStatusChange, config: Required<NetworkStatusConfig>){
    this.startFetching(onStatusChange, config);
    return {
      stop: () => this.stopFetching()
    }
  }
  
  getCurrentState() { return this.networkInfo }
}



