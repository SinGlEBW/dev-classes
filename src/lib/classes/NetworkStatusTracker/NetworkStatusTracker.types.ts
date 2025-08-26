export interface NetworkInfoConnection {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string; // Только для поддерживающих браузеров
}

export interface NetworkStatusInfoTracker{
  isNetwork: boolean;
  typeNetwork: string;
}
export interface NetworkStatusConfig {
  interval?: number;
}

export interface NetworkConstructorConfig {
  timeout?: number;
}
export type OnStatusChange = (info: NetworkStatusInfoTracker) => void;



 export interface NetworkItemListTracker {
  keyNameSystem: string, 
  getInfo: () => NetworkStatusInfoTracker
} 