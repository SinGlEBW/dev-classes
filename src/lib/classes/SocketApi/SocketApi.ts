import { DelaysPromise } from "@classes/DelaysPromise/DelaysPromise";
import { NetworkInformationCordova, NetworkInformationPC } from "@classes/Utils/NetworkInformation/classes";
import uuid4 from "uuid4";
import { EventSubscribers } from "../Utils/EventSubscribers/EventSubscribers";
import { NetworkInformation } from "../Utils/NetworkInformation/NetworkInformation";
import type { SocketApi_Options_P, SocketApi_State_P } from "./SocketApi.types";
import { WsApi, WsApi_Options_P } from "./deps/WsApi";
/*
  TODO: Передавать опции
  SocketApi.init({
    isReconnect: true//Если появиться интернет
  })
*/
//Последняя версия

interface SocketApi_Events {
  timeOffReConnect(info: { status: boolean; msg: string }): void;
  reConnect(status: boolean): void;
}

export class SocketApi {
  private static state: SocketApi_State_P = {
    isDisconnect: true,
    isActiveReConnect: false,
    isOfflineSocket: true,
    isReady: false,
    isNetworkStatus: navigator.onLine,
  };
  private static options: SocketApi_Options_P = {
    isReConnectNetworkOnline: false,
  };
  private static wsApi = new WsApi();
  private static delay = new DelaysPromise();
  private static internet = new NetworkInformation([new NetworkInformationPC(), new NetworkInformationCordova()]);
  private static events = new EventSubscribers<SocketApi_Events>(["timeOffReConnect", "reConnect"]);
  private static saveID: Partial<Record<"idReConnect" | "checkConnect", number | null>> = {
    idReConnect: null,
    checkConnect: null,
  };
  private static stateDefault = SocketApi.copyState(SocketApi.state);

  private static copyState(state) {
    return JSON.parse(JSON.stringify(state));
  }
  private static setState(state: Partial<typeof SocketApi.state>) {
    SocketApi.state = { ...SocketApi.state, ...state };
  }
  private static resetState() {
    SocketApi.state = SocketApi.copyState(SocketApi.stateDefault);
  }
  private static setOptions(options: Partial<SocketApi_Options_P>) {
    SocketApi.options = { ...SocketApi.options, ...options };
  }

  private static setStatusReConnect(status: boolean) {
    SocketApi.setState({ isActiveReConnect: status });
    SocketApi.events.publish("reConnect", status);
  }
  private static setInfoConnect = (info) => {
    if (!info.status) {
      SocketApi.close();
    }
    SocketApi.setState({ isOfflineSocket: !info.status });
    SocketApi.events.publish("timeOffReConnect", info);
    SocketApi.setStatusReConnect(false);
  };
  private static online = () => {
    SocketApi.setState({ isNetworkStatus: true });
    if (!SocketApi.state.isActiveReConnect && SocketApi.options.isReConnectNetworkOnline) {
      SocketApi.socketReConnect();
    }
  };
  private static offline = () => {
    //SocketApi.config.isReConnect
    SocketApi.setState({ isNetworkStatus: false });
    if (SocketApi.state.isActiveReConnect) {
      SocketApi.stopReConnect(false);
    }
  };

  private static splitOptions = (options: WsApi_Options_P & SocketApi_Options_P) => {
    return Object.entries(options).reduce(
      (acc, [key, value]) => {
        const currentWsOptions = SocketApi.wsApi.getOptions();
        if (key in currentWsOptions) {
          return { ...acc, WsOptions: { ...acc.WsOptions, [key]: value } };
        }
        return { ...acc, SocketApiOptions: { ...acc.SocketApiOptions, [key]: value } };
      },
      { WsOptions: {}, SocketApiOptions: {} } as { WsOptions: WsApi_Options_P; SocketApiOptions: SocketApi_Options_P }
    );
  };
  /*---------------------------------------------------------------------------------------------------------------------------*/
  static getState = () => SocketApi.state;
  static on: typeof SocketApi.wsApi.on & typeof SocketApi.events.subscribe = (name, listener) => {
    const wsApi_RegisteredEvents = SocketApi.wsApi.getRegisteredEvents();
    if (!wsApi_RegisteredEvents.includes(name)) {
      SocketApi.events.subscribe(name, listener);
    } else {
      SocketApi.wsApi.on(name, listener);
    }
  };
  static off: typeof SocketApi.wsApi.on & typeof SocketApi.events.subscribe = (name, listener) => {
    const wsApi_RegisteredEvents = SocketApi.wsApi.getRegisteredEvents();
    if (!wsApi_RegisteredEvents.includes(name)) {
      SocketApi.events.unsubscribe(name, listener);
    } else {
      SocketApi.wsApi.off(name, listener);
    }
  };
  // static getRequestSave = SocketApi.wsApi.getRequestSave;
  static getStatusSocket = SocketApi.wsApi.getStatusSocket;
  static close = () => {
    if (SocketApi.state.isActiveReConnect) {
      SocketApi.stopReConnect(false);
    } else {
      SocketApi.wsApi.close();
    }
  };

  static init = (options: WsApi_Options_P & SocketApi_Options_P) => {
    const { WsOptions, SocketApiOptions } = SocketApi.splitOptions(options);
    SocketApi.internet.run((status) => {
      status ? SocketApi.online() : SocketApi.offline();
    });
    SocketApi.setOptions(SocketApiOptions);
    SocketApi.wsApi.init(WsOptions);
  };

  static connect() {
    if (SocketApi.wsApi.getIsInitWS()) {
      console.log("CONNECT WS");
      SocketApi.setState({ isDisconnect: false });
      SocketApi.wsApi.connect();
    }
  }

  static disconnect() {
    if (!SocketApi.state.isDisconnect) {
      SocketApi.setState({ isDisconnect: true });
      console.log("DISCONNECT WS");
      SocketApi.wsApi.disconnect();
      SocketApi.resetState();
    }
  }

  static send<ResType>(data: object, cb?: (data: ResType) => void) {
    const { action, ...payload } = data as any;

    const reqId = uuid4();
    SocketApi.wsApi.setRequestSave({
      reqId,
      payload: { action, ...payload },
      cb,
    });
    const ws = SocketApi.wsApi.getSocket();
    /*FIXME: Нужно слать id запроса, после ответ искать по id, потому что может быть запрошено несколько */
    if (!ws || ws.readyState !== 1) {
      console.log("Нет подключения к сокету");
      return;
    }
    SocketApi.wsApi.send(JSON.stringify(data));
  }

  static stopReConnect(status?: boolean) {
    console.dir("функция stop не присвоена к stopReConnect");
  }

  static #getTimeRequest() {
    //TODO: придумать как получить время запроса. Нужно ориентироваться на action ответа что бы понимать ответ данного сообщения
  }

  /*------------------------------------------------------------------------------------------------------*/

  // useEffect(() => {
  //   if((isReConnectSocket && (!isNetworkStatus || statusWS === 'ready'))){
  //     SocketApi.stopReConnect();
  //   }
  // },[isReConnectSocket, isNetworkStatus, statusWS]);

  static socketReConnect = () => {
    if (!SocketApi.wsApi.getIsInitWS()) {
      return;
    }

    console.log("reconnect");
    if (!SocketApi.saveID.idReConnect) {
      SocketApi.setStatusReConnect(true);

      SocketApi.connect();
      const { timeReConnect, numberOfRepit } = SocketApi.wsApi.getOptions();
      SocketApi.delay
        .startActionEvery(
          () => {
            console.log("reconnect:>>delay");
            if (SocketApi.wsApi.getStatusSocket() === "ready") {
              console.dir("Подключение установлено");
              return true;
            }
            SocketApi.connect();
            return false;
          },
          {
            interval: timeReConnect,
            countAction: numberOfRepit,
            watchIdInterval: (id) => {
              SocketApi.saveID.idReConnect = id;
            },
            controlAction: ({ stop, getIsActiveEvent }) => {
              SocketApi.stopReConnect = stop;
            },
          }
        )
        .then(SocketApi.setInfoConnect)
        .catch(SocketApi.setInfoConnect);
    } else {
      console.groupCollapsed("Процесс socketReConnect уже запущен");
      console.log("SocketApi.saveID: ", SocketApi.saveID);
      console.groupEnd();
    }
  };
}


// const idInterval = setInterval(() => {
//   const isActive = getIsActiveEvent()
//   if(!SocketApi.wsApi.internet.isOnline){
//     clearInterval(idInterval);
//     stop();
//     return;
//   }
//   if (SocketApi.wsApi.state.statusConnect === "ready") {
//     clearInterval(idInterval);
//     stop();
//   }else if(!isActive){
//     clearInterval(idInterval);
//   }

// }, SocketApi.intervalCheckConnectSocket);
