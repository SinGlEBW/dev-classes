import { EventSubscribers } from "@classes/Utils/EventSubscribers/EventSubscribers";
import type { WsApi_Events, WsApi_Options_P, WsApi_StateProps, WsApiE_StatusConnect_OR } from "./WsApi.types";

//INFO: Назначать функции стрелочными иначе this не читаем

export class WsApi {
  private options: WsApi_Options_P = {
    timeReConnect: 5000,
    numberOfRepit: 5,
    url: "",
  };

  private state: WsApi_StateProps = {
    statusConnect: "disconnect",
    ws: null,
    arrSaveReq: [],
  };

  private initOptions = false;
  private events = new EventSubscribers<WsApi_Events>(["status", "msg"]);

  private stateDefault = this.copyState(this.state);
  private resetState() {
    this.state = this.copyState(this.stateDefault);
  }
  private setState(state: Partial<typeof this.state>) {
    this.state = { ...this.state, ...state };
  }
  private eventListener = (action: "add" | "remove") => {
    const entriesSocketEvents = [
      ["open", this.openHandler],
      ["close", this.closeHandler],
      ["message", this.msgHandler],
      ["error", this.errHandler],
    ] as const;
    for (let i = 0; i < entriesSocketEvents.length; i++) {
      const [keyEvent, watchEvent] = entriesSocketEvents[i];
      if (action === "add") {
        this.state.ws?.addEventListener(keyEvent, watchEvent);
      } else {
        this.state.ws?.removeEventListener(keyEvent, watchEvent);
      }
    }
  };

  private openHandler = () => {
    this.setStatus("ready");
  };

  private closeHandler = () => {
    this.setStatus("close");
  };

  private msgHandler = (e) => {
    const data = JSON.parse(e.data ? e.data : "{}");
    try {
      const { action } = data;
      action && this.setResponceInReqSave(data);
      this.events.publish("msg", data);
    } catch (error) {
      this.events.publish("msg", JSON.parse("{}"));
    }
  };

  private errHandler = (err) => {
    this.setStatus("error");
  };

  private copyState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  private setResponceInReqSave(responce: { action: string; [key: string]: any }) {
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
  }

  private removeRequestItemSave(action: string) {
    const newTotalRequestSave = this.state.arrSaveReq.filter((item) => item.payload?.action !== action);
    this.state.arrSaveReq = newTotalRequestSave;
  }

  private errorInitSocket = () => {
    console.error("Вы не установили опции");
  };

  /*----------------------------------------------------------------------------------------------------------*/
  getRegisteredEvents = () => this.events.getListNameEvents();
  send(data) {
    const messageSend = JSON.stringify(data);
    this.state.ws?.send(messageSend);
  }

  getIsInitWS = () => {
    const status = this.initOptions;
    if (!status) {
      this.errorInitSocket();
    }
    return status;
  };
  getSocket = () => this.state.ws;

  getOptions = () => this.options;

  init = (options: typeof this.options) => {
    this.initOptions = true;
    this.options = { ...this.options, ...options };
  };

  getStatusSocket = () => this.state.statusConnect;

  private setStatus = (status: WsApiE_StatusConnect_OR) => {
    this.events.publish("status", status);
    this.setState({ statusConnect: status });
  };

  on = this.events.subscribe;
  off = this.events.unsubscribe;

  setRequestSave(reqInfo: (typeof this.state.arrSaveReq)[number]) {
    if ("action" in reqInfo.payload) {
      const findItemInx = this.state.arrSaveReq.findIndex((item) => item.payload.action === reqInfo.payload.action);
      if (~findItemInx) {
        this.state.arrSaveReq[findItemInx] = reqInfo;
      } else {
        this.state.arrSaveReq.push(reqInfo);
      }
    }
  }

  getRequestSave = () => this.state.arrSaveReq;
  connect() {
    if (this.initOptions) {
      this.close();
      this.setState({
        ws: new WebSocket(this.options.url),
      });
      this.setStatus("pending");
      this.eventListener("add");
    }
  }

  close() {
    this.state.ws?.close();
    this.eventListener("remove");
  }

  disconnect() {
    this.close();
    this.resetState();
  }
}
