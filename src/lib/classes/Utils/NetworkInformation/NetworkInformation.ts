import type { NetworkInformationAbstract, WatcherCB } from './classes/types/types.abscruct';




export class NetworkInformation {
  private listNetworkInformation: NetworkInformationAbstract[] = [];

  constructor(listNetworkInformation: NetworkInformationAbstract[]){
    this.listNetworkInformation = listNetworkInformation;
  } 
  private getSystem(){
    const { cordova } = window as any
    if(cordova){
      return 'cordova'
    }
    return 'pc'
  }

  run(watcher: WatcherCB) {
    const nameSystem = this.getSystem()
    const findControlsthis = this.listNetworkInformation.find(ni => ni.getControls().system === nameSystem);
    
    if(findControlsthis){
      
      findControlsthis.getControls().addWatchers(watcher)
    }else{
      console.error(`NetworkInformation не активен на данной платформе`);
    }
  }
  stop(){
    this.listNetworkInformation.forEach((networkInformation) => {
      networkInformation.getControls().removeWatchers();
    })
  }
}







