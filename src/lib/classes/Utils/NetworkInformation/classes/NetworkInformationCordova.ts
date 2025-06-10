import { NetworkInformationAbstract, type WatcherCB } from './types/types.abscruct';

export type CordovaNetworkStatus = 'unknown' | 'none' | 'wifi' | '2g' | '3g' | '4g';
export class NetworkInformationCordova extends NetworkInformationAbstract{
  protected watchers = (cb: WatcherCB) => {
    const cbError = (err) => { console.error(err); }
    const watcher = (status: CordovaNetworkStatus) => {
      cb(!(status === "unknown" || status === "none"), status)
    }
    (navigator as any)?.connection.getInfo(watcher, cbError)
  }
  getControls = () => ({
    system: 'cordova' as const,
    addWatchers: this.watchers,
    removeWatchers: () => {}
  })
}