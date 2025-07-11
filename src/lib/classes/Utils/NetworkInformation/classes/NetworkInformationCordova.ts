import { NetworkInformationAbstract, type WatcherCB } from './types/types.abscruct';

export type CordovaNetworkStatus = 'unknown' | 'none' | 'wifi' | '2g' | '3g' | '4g';
export class NetworkInformationCordova extends NetworkInformationAbstract{
  protected watchers = (cb: WatcherCB) => {
    const cbError = (err) => { console.error(err); }
    const watcher = (status: CordovaNetworkStatus) => {

      const is = !["none", "unknown"].includes(status);
      // cb(!(status === "unknown" || status === "none"), status)
      cb(is, status)
    }


    if ((navigator as any)?.connection && "getInfo" in (navigator as any)?.connection) {
      // (navigator as any)?.connection.getInfo(watcher, cbError)
      const getStatus = () => (navigator as any)?.connection?.type;
      const networkWatcher = () => {
        const typeNetwork = getStatus();
        watcher(typeNetwork)
      }
      networkWatcher();
      document.addEventListener("offline", networkWatcher, false);
      document.addEventListener("online", networkWatcher, false);

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