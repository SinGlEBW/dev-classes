
import uuid4 from "uuid4";

import { ConnectOptions_P, EventNames_OR, GetCbByKeyNameEvent, WsApi } from "./deps/WsApi";

interface WatchI {
  watchTimeOffReConnect(info: { status: boolean; msg: string }): void;
  watchReConnect(status: boolean): void;
}

class Watch implements WatchI {
  watchTimeOffReConnect(info: { status: boolean; msg: string }): void {}
  watchReConnect(status: boolean): void {}
}

export class SocketApi {
  private static wsApi = new WsApi();
  private static watch = new Watch();
  static state = {
    isDisconnect: true,
    initConnect: false,
    isReConnect: false,
  };
  private static saveID: Partial<Record<"idConnect" | "checkConnect", number | null>> = {
    idConnect: null,
    checkConnect: null,
  };
  private static stateDefault = SocketApi.copyState(SocketApi.state);

  static on<K extends EventNames_OR>(eventName: K, cb: GetCbByKeyNameEvent<K>) {
    return SocketApi.wsApi.on(eventName, cb);
  }
  static off<K extends EventNames_OR>(eventName: K, cb: GetCbByKeyNameEvent<K>) {
    SocketApi.wsApi.off(eventName, cb);
  }
  static setOptions = (option: ConnectOptions_P = SocketApi.wsApi.configWs) => {
    if (!SocketApi.state.initConnect) {
      SocketApi.state.initConnect = true;
      SocketApi.wsApi.configWs = {...SocketApi.wsApi.configWs, ...option};
      SocketApi.wsApi.internet.addWatcherInternet();
    }
  };
  static close() {
    SocketApi.resetSocket();
    SocketApi.wsApi.setStatus("close");
  }
  static disconnect() {
    if (!SocketApi.state.isDisconnect) {
      SocketApi.state.isDisconnect = true;
      console.log("DISCONNECT WS");
      SocketApi.wsApi.internet.removeWatcherInternet();
      SocketApi.wsApi.setStatus("disconnect");
      SocketApi.resetSocket();
      SocketApi.resetState();
      SocketApi.wsApi.resetState();
    }
  }

  static send<ResType>(data: object) {
    return new Promise<ResType>((resolve, reject) => {
      const { action, ...payload } = data as any;
      /*FIXME: Нужно слать id запроса, после ответ искать по id, потому что может быть запрошено несколько */
      if (!SocketApi.wsApi.state.ws || SocketApi.wsApi.state.ws.readyState !== 1) {
        if (!SocketApi.wsApi.state.arrSaveReq.some((item) => item.action === (data as any).action)) {
          SocketApi.wsApi.state.arrSaveReq.push(data);
          console.log('Нет подключения к сокету. Данные запроса сохранены', SocketApi.wsApi.state.arrSaveReq);
        }
        return;
      }

      const reqId = uuid4();
      SocketApi.wsApi.totalInfoReqPromise.push({ action, reqId, resolve, reject });
      SocketApi.wsApi.state.ws?.send(JSON.stringify(data));

      if (SocketApi.wsApi.state.arrSaveReq.length && !SocketApi.wsApi.state.isRequestArrSaveReq) {
        SocketApi.wsApi.state.isRequestArrSaveReq = true;
      }
    });
  }
  
  static connect() {
    SocketApi.createConnect();
  }
  static stopReConnect() {
    console.dir("функция stop не присвоена к stopReConnect");
  }
  static resetState() {
    SocketApi.state = SocketApi.copyState(SocketApi.stateDefault);
  }
  static getTimeRequest() {
    //TODO: придумать как получить время запроса. Нужно ориентироваться на action ответа что бы понимать ответ данного сообщения
  }

  static getEndReq = () => SocketApi.wsApi.state.arrSaveReq;
  /*------------------------------------------------------------------------------------------------------*/
  static watchReConnect(cb: WatchI["watchReConnect"]) {
    SocketApi.watch.watchReConnect = cb;
  }
  static watchTimeOffReConnect(cb: WatchI["watchTimeOffReConnect"]) {
    SocketApi.watch.watchTimeOffReConnect = cb;
  }
  /*------------------------------------------------------------------------------------------------------*/
  private static copyState(state) {
    return JSON.parse(JSON.stringify(state));
  }
  private static resetSocket() {
    SocketApi.wsApi.state.ws?.close();
    SocketApi.wsApi.removeEvents();
  }
  private static createConnect() {
    console.log("CONNECT WS");
    SocketApi.resetSocket();
    SocketApi.state.isDisconnect = false;
    SocketApi.wsApi.state.ws = new WebSocket(SocketApi.wsApi.configWs.url);
    SocketApi.wsApi.setStatus("pending");
    SocketApi.wsApi.addEvents();
  }
  static socketReConnect = () => {
    if (!SocketApi.saveID.idConnect) {
      SocketApi.state.isReConnect = true;
      SocketApi.watch.watchReConnect(true);
      SocketApi.createConnect();
      SocketApi.wsApi
        .startActionEvery(
          () => {
            if (SocketApi.wsApi.state.statusConnect === "ready") {
              return true;
            }
            SocketApi.createConnect();
            return false;
          },
          {
            interval: SocketApi.wsApi.configWs.timeReConnect,
            countAction: SocketApi.wsApi.configWs.numberOfRepit,
            watchIdInterval: (id) => {
              SocketApi.saveID.idConnect = id;
            },
            controlAction: ({ stop, getIsActiveEvent }) => {
              console.group("Вызван controlAction");
                console.log("getIsActiveEvent не используется");
              console.groupEnd();
              SocketApi.stopReConnect = () => {
                stop();
              };

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
            },
          }
        )
        .then(SocketApi.setInfoConnect)
        .catch(SocketApi.setInfoConnect);
    } else {
      console.groupCollapsed("Процесс idConnect уже запущен");
      console.log("SocketApi.saveID: ", SocketApi.saveID);
      console.groupEnd();
    }
  };

  private static setInfoConnect = (info) => {
    if(!info.status){
      SocketApi.close();
    }
    SocketApi.watch.watchTimeOffReConnect(info);
    SocketApi.watch.watchReConnect(false);
    SocketApi.state.isReConnect = false;
  };
}

