import { InternetWatchers } from './InternetWatchers';
import { NetworkInformationAbstract, type WatcherCB } from './types/types.abscruct';

export class NetworkInformationPC extends NetworkInformationAbstract{
  private network = new InternetWatchers();
  protected watchers = (cb: WatcherCB) => {
    navigator.onLine ? cb(true) : cb(false)
    this.network.addWatchers(cb);
  }
  getControls = () => ({
    system: 'pc' as const,
    addWatchers: this.watchers,
    removeWatchers: this.network.removeWatchers
  })
}
