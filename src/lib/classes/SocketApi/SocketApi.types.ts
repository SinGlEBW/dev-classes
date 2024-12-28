export interface SocketApi_Options_P {
  isReConnectNetworkOnline?: boolean;
}

type SocketApi_State_OR = 'isDisconnect' | 'isActiveReConnect' | 'isOfflineSocket' | 'isReady' | 'isNetworkStatus';
export type SocketApi_State_P = Record<SocketApi_State_OR, boolean>;