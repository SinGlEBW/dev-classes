export interface ConnectOptions_P {
  timeReConnect: number;
  // getInfoByTimeReConnect?: (info: { status: boolean; msg: string }) => void;
}

export type EventNameType = "msg" | "status";
export type SubscribersEventsType = Record<EventNameType, any[]>;
export type SubscriberType<T> = (msg: T) => void;

export type StatusConnectWsAPI = "pending" | "ready" | "error" | "close" | "disconnect";
export interface WsApiStateDefaultI {
  statusConnect: StatusConnectWsAPI;
  ws: null | WebSocket;
  url: string;
}

export interface WsApiStateSaveDefaultI {
  isRequestArrSaveReq: boolean;
  arrSaveReq: any[];
  subscribersEvents: SubscribersEventsType;
}
