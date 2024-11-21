export interface ConnectOptions_P {
  url: string;
  timeReConnect: number;
  numberOfRepit?: number;
  // getInfoByTimeReConnect?: (info: { status: boolean; msg: string }) => void;
}

export type EventNames_OR = "msg" | "status";
export type StatusConnect_OR = "pending" | "ready" | "error" | "close" | "disconnect";



interface EventByStatus {
  event: 'status'
  cb(status: StatusConnect_OR): void
}

interface EventByMSG {
  event: 'msg'
  cb(payload:any): void
}

interface EventsInfoByName_P{
  status: EventByStatus;
  msg: EventByMSG;
}


export type GetCbByKeyNameEvent<K extends EventNames_OR> = EventsInfoByName_P[K]['cb'];




export type SubscribersEvents_P = Record<EventNames_OR, any[]>;


export interface WsApiStateDefaultI {
  statusConnect: StatusConnect_OR;
  ws: null | WebSocket;

}

export interface WsApiStateSaveDefaultI {
  isRequestArrSaveReq: boolean;
  arrSaveReq: {payload: {action: string, [key: string]: any}, reqId: string, cb: any}[];
  subscribersEvents: SubscribersEvents_P;
}
