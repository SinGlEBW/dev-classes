import type { EventSubscribersProps } from './EventSubscribers.types'


export class EventSubscribers<EventsProps extends {[K in keyof EventsProps]: (...args: any[]) => any}>{
  private subscribersEvents: {[K in keyof EventsProps]?: EventsProps[K][]} = {}
  constructor(eventsRegister: (keyof EventsProps)[]) {
    eventsRegister.forEach((name) => {
      this.subscribersEvents[name] = []
    })
  }
  getListNameEvents = () => Object.keys(this.subscribersEvents)
  getSubscribers = () => this.subscribersEvents
  subscribe: EventSubscribersProps<EventsProps>['subscribe'] = (name, cb) => {
    // if(!this.subscribersEvents[name]) this.subscribersEvents[name] = [];
    this.subscribersEvents[name]?.push(cb)
  }
  unsubscribe: EventSubscribersProps<EventsProps>['unsubscribe'] = (name, cb) => {
    if(this.subscribersEvents[name]){
      this.subscribersEvents[name] = this.subscribersEvents[name]?.filter((s) => s !== cb);
    }
  }
  publish: EventSubscribersProps<EventsProps>['publish'] = (name, data) => {
    if (this.subscribersEvents[name]) {
      this.subscribersEvents[name]?.forEach((callback) => {
        callback(data)
      })
    }
  }
  resetSubscribers:EventSubscribersProps<EventsProps>['resetSubscribers'] = () => {
    this.subscribersEvents = {}
  }
}
