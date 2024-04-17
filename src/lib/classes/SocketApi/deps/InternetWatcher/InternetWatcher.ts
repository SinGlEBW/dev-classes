export class InternetWatcher {
  isOnline: boolean = window.navigator.onLine;
  private isWatcher = false;
  private watchIsOffline(){
    this.isOnline = false;
  }
  private watchIsOnline(){
    this.isOnline = true;
  }
  addWatcherInternet(){
    if(!this.isWatcher){ console.dir('Установка событий (online, offline) InternetWatcher.addWatcherInternet');
      this.isWatcher = true;
      window.addEventListener("offline", this.watchIsOffline);
      window.addEventListener("online", this.watchIsOnline);
    }
  }
  removeWatcherInternet(){
    if(this.isWatcher){ console.dir('Удаление событий (online, offline) InternetWatcher.addWatcherInternet');
      window.removeEventListener("offline", this.watchIsOffline);
      window.removeEventListener("online", this.watchIsOnline);
      this.isOnline = false;
      this.isWatcher = false;
    }
  }
}