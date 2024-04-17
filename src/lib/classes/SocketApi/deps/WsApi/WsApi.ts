import { DelaysPromise } from "@classes/Delay";

import { ConnectOptions_P, EventNameType, StatusConnectWsAPI, SubscriberType, WsApiStateDefaultI, WsApiStateSaveDefaultI } from "./types.d";
import { InternetWatcher } from "../InternetWatcher/InternetWatcher";

//INFO: Назначать функции стрелочными иначе this не читаем


export class WsApi extends DelaysPromise {

  configWs: ConnectOptions_P = {
    timeReConnect: 5000,
  };
  internet = new InternetWatcher();

  state: WsApiStateDefaultI & WsApiStateSaveDefaultI = {
    statusConnect: "disconnect",
    ws: null,
    url: process.env.REACT_APP_URL_WS as string,
    isRequestArrSaveReq: false,
    arrSaveReq: [],
    subscribersEvents: {
      msg: [],
      status: [],
    },
  };
  // saveState: WsApiStateSaveDefaultI = {
  
  // };
  totalInfoReqPromise: { action: string; reqId: string; resolve: any; reject: any }[] = [];
  private stateDefault = this.copyState(this.state);

  setStatus = (status: StatusConnectWsAPI) => {
    this.sendInformationToTheEvent("status", status);
    this.state.statusConnect = status;
  };

  removeEvents = () => {
    this.state.ws?.removeEventListener("open", this.openHandler);
    this.state.ws?.removeEventListener("close", this.closeHandler);
    this.state.ws?.removeEventListener("message", this.msgHandler);
    this.state.ws?.removeEventListener("error", this.errHandler);
  };

  addEvents = () => {
    this.state.ws?.addEventListener("open", this.openHandler);
    this.state.ws?.addEventListener("close", this.closeHandler);
    this.state.ws?.addEventListener("message", this.msgHandler);
    this.state.ws?.addEventListener("error", this.errHandler);
  };


  openHandler = () => {
    console.log("this >> open");
    this.setStatus("ready");
  };

  closeHandler = () => {
    console.log("this >> close");
    this.setStatus("close");
  };

  on<T>(eventName: EventNameType, cb: SubscriberType<T>) {
    this.state.subscribersEvents[eventName].push(cb);
    return () => {
      this.state.subscribersEvents[eventName] = this.state.subscribersEvents[eventName].filter((s) => s !== cb);
    };
  }
  off<T>(eventName: EventNameType, cb: SubscriberType<T>) {
    this.state.subscribersEvents[eventName] = this.state.subscribersEvents[eventName].filter((s) => s !== cb);
  }

  msgHandler = (e) => {
    //TODO:
    let data = JSON.parse(e.data ? e.data : "{}");

    if ("action" in data && this.state.arrSaveReq.length) {
      let findInx = this.state.arrSaveReq.findIndex((item) => item.action === data.action);
      if (~findInx) this.state.arrSaveReq.splice(findInx, 1);
    }
    if (!this.state.arrSaveReq.length && this.state.isRequestArrSaveReq) this.state.isRequestArrSaveReq = false;

    try {
      let { action } = data;

      //FIXME: Пока ориентируемся по action. Нужно на сервер отсылать reqId и получать для точного ориентира промисов
      let editTotalInfoReqPromise: any[] = [];
      for (let i = 0; i < this.totalInfoReqPromise.length; i++) {
        const itemReq = this.totalInfoReqPromise[i];
        if (itemReq.action !== action) {
          editTotalInfoReqPromise.push(itemReq);
        } else {
          itemReq.resolve && itemReq.resolve(data);
        }
      }
      this.totalInfoReqPromise = editTotalInfoReqPromise;
      this.sendInformationToTheEvent('msg', data);
    } catch (error) {
      this.sendInformationToTheEvent('msg', JSON.parse("{}"));
    }
  };

  errHandler = (err) => {
    /*
      INFO: При переключении интернета не рассчитывая на React нужно запускать таймаут
    */
    console.log("this >> err");
    this.setStatus("error");
  };
  private copyState(state) {
    return JSON.parse(JSON.stringify(state));
  }
  resetState() {
    this.state = this.copyState(this.stateDefault);
  }
  
  private sendInformationToTheEvent = (nameEvent: keyof typeof this.state.subscribersEvents, data) => {
    this.state.subscribersEvents[nameEvent]?.forEach((cb) => cb(data));
  };
}

// (window as any).SB = subscribersEvents;
