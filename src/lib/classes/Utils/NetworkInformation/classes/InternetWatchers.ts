const defaultState = {
  isNetworkStatus: window.navigator.onLine,
  listCloseSignals: [] as AbortController[],
  isWatcher: false
}


export class InternetWatchers {
  private state = defaultState;
  private resetState = () => this.state = defaultState;
  addWatchers(cb: (status: boolean) => void){
    if(!this.state.isWatcher){
      this.state.isWatcher = true;
      const list = [
        {event: 'online', status: true},
        {event: 'offline', status: false}
      ];
      for (let i = 0; i < list.length; i++) {
        const controller = new AbortController();
        const { event, status } = list[i];
        this.state.listCloseSignals.push(controller);
        window.addEventListener(event, () => cb(status), { signal: controller.signal });
      }
    }
  }
  
  removeWatchers(){
    if(this.state.isWatcher){ 
      for (let i = 0; i < this.state.listCloseSignals.length; i++) {
        const controller = this.state.listCloseSignals[i];
        controller?.abort();
      }
      this.resetState();
    }
  }
}

