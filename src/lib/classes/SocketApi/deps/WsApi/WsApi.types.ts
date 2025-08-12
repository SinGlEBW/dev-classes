
export interface WsApi_Options_P {
  url: string;
  timeReConnect: number;
  numberOfRepit?: number;
}

export type WsApiE_StatusConnect_OR = "pending" | "ready" | "error" | "close" | "disconnect";

export interface WsApi_Events {
  status(status: WsApiE_StatusConnect_OR): void
  msg(message: any): void
}

export interface WsApi_StateProps {
  statusConnect: WsApiE_StatusConnect_OR;
  ws: null | WebSocket;
  arrSaveReq: {payload: {action: string, [key: string]: any}, reqId: string, cb: any}[];
}

