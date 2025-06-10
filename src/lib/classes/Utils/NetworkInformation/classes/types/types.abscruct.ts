export type SystemType = 'pc' | 'cordova';

export type WatcherCB = (status: boolean, textStatus: string) => void

export abstract class NetworkInformationAbstract {
  protected abstract watchers (cb: WatcherCB) : void;
  abstract getControls(): {
    system: SystemType, 
    addWatchers: (cb: WatcherCB) => void
    removeWatchers: () => void
  }
}
