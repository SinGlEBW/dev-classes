import { DelaysPromise } from "@classes/Delay/Delay";

import { InternetWatcher } from "../InternetWatcher/InternetWatcher";
import { ConnectOptions_P, EventNames_OR, StatusConnect_OR, WsApiStateDefaultI, WsApiStateSaveDefaultI, type GetCbByKeyNameEvent } from "./WsApi.types";

//INFO: Назначать функции стрелочными иначе this не читаем


export class WsApi extends DelaysPromise {

  configWs: ConnectOptions_P = {
    timeReConnect: 5000,
    numberOfRepit: 5,
    url: '',
  };
  internet = new InternetWatcher();

  state: WsApiStateDefaultI & WsApiStateSaveDefaultI = {
    statusConnect: "disconnect",
    ws: null,
    arrSaveReq: [],
    subscribersEvents: {
      msg: [],
      status: [],
    },
  };

  private stateDefault = this.copyState(this.state);

  getStatus = () => this.state.statusConnect;
  setStatus = (status: StatusConnect_OR) => {
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

    // const requestSave = this.getRequestSave();
    // if(requestSave.length){
    //   for (let i = 0; i < requestSave.length; i++) {
    //     const itemRequestSave = requestSave[i];
    //     this.state.ws?.send(JSON.stringify(itemRequestSave.payload));
    //     itemRequestSave?.payload?.action && this.removeRequestItemSave(itemRequestSave?.payload?.action);
    //   } 
    // }
  };

  closeHandler = () => {
    console.log("this >> close");
    this.setStatus("close");
  };
 
  on<K extends EventNames_OR>(eventName: K, cb: GetCbByKeyNameEvent<K>) {
    this.state.subscribersEvents[eventName].push(cb);
    return () => {
      this.state.subscribersEvents[eventName] = this.state.subscribersEvents[eventName].filter((s) => s !== cb);
    };
  }
  off<K extends EventNames_OR>(eventName: K, cb: GetCbByKeyNameEvent<K>) {
    this.state.subscribersEvents[eventName] = this.state.subscribersEvents[eventName].filter((s) => s !== cb);
  }

  msgHandler = (e) => {
 
    const data = JSON.parse(e.data ? e.data : "{}");

    
    try {
      const { action } = data;
      action && this.setResponceInReqSave(data);

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

  setRequestSave(reqInfo: typeof this.state.arrSaveReq[number]) {
    if ("action" in reqInfo.payload) {
      const findItemInx = this.state.arrSaveReq.findIndex((item) => item.payload.action === reqInfo.payload.action);
      if (~findItemInx) {
        this.state.arrSaveReq[findItemInx] = reqInfo;
      }else{
        this.state.arrSaveReq.push(reqInfo);
      }
    }
  }

  removeRequestItemSave(action: string) {
    const newTotalRequestSave = this.state.arrSaveReq.filter((item) => item.payload?.action !== action);
    this.state.arrSaveReq = newTotalRequestSave
  }
  getRequestSave() {
    return this.state.arrSaveReq
  }
  setResponceInReqSave(responce: {action: string, [key: string]: any}) {
    
    const requestSave = this.getRequestSave();
      const filterArrSaveReq: any[] = [];
      for (let i = 0; i < requestSave.length; i++) {
        const itemReq = requestSave[i];
        if (itemReq.payload.action !== responce.action) {
          filterArrSaveReq.push(itemReq);
        } else {
          itemReq.cb && itemReq.cb(responce);
        }
      }

      this.state.arrSaveReq = filterArrSaveReq;
      console.log('filterArrSaveReq', filterArrSaveReq)
  }
}


