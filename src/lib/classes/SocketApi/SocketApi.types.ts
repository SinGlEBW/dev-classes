import type { WsApiE_StatusConnect_OR } from './deps/WsApi';

export interface SocketApi_Options_P {
  isReConnectNetworkOnline?: boolean;
}

type SocketApi_StateProps_OR = 'isDisconnect' | 'isActiveReConnect' | 'isOfflineSocket' | 'isReady' | 'isNetworkStatus';
export type SocketApi_StateProps_P = Record<SocketApi_StateProps_OR, boolean>;
export type SocketApi_StatusConnect_OR = WsApiE_StatusConnect_OR;