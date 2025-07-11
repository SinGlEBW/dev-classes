import { NetworkInformationAbstract, type WatcherCB } from './types/types.abscruct';

export type CordovaNetworkStatus = 'unknown' | 'none' | 'wifi' | '2g' | '3g' | '4g';
export class NetworkInformationCordova extends NetworkInformationAbstract{
  protected watchers = (cb: WatcherCB) => {
    const cbError = (err) => { console.error(err); }
    const watcher = (status: CordovaNetworkStatus) => {

      console.dir('watcher status', status);
      // cb(!(status === "unknown" || status === "none"), status)
      cb(!["none", "unknown"].includes(status), status)
    }


    if ((navigator as any)?.connection && "getInfo" in (navigator as any)?.connection) {
      (navigator as any)?.connection.getInfo(watcher, cbError)
    }else{
      console.error("Нету navigator.connection.getInfo");
    }
  }

  getControls = () => ({
    system: 'cordova' as const,
    addWatchers: this.watchers,
    removeWatchers: () => {}
  })
}