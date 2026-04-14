import type { EventSubscribersProps } from './EventSubscribers.types'

export class EventSubscribers<EventsProps extends {[K in keyof EventsProps]: (...args: any[]) => any}>{
  private subscribersEvents: {[K in keyof EventsProps]?: Set<EventsProps[K]>} = {}
  
  constructor(eventsRegister: (keyof EventsProps)[]) {
    eventsRegister.forEach((name) => {
      this.subscribersEvents[name] = new Set()
    })
  }
  
  getListNameEvents = () => Object.keys(this.subscribersEvents) as (keyof EventsProps)[]
  
  getSubscribers = () => this.subscribersEvents
  
  subscribe: EventSubscribersProps<EventsProps>['subscribe'] = (name, cb) => {
    if(!this.subscribersEvents[name]) {
      this.subscribersEvents[name] = new Set()
    }
    this.subscribersEvents[name]?.add(cb)

    return () => {
      this.unsubscribe(name, cb)
    }
  }
  
  unsubscribe: EventSubscribersProps<EventsProps>['unsubscribe'] = (name, cb) => {
    if(this.subscribersEvents[name]){
      this.subscribersEvents[name].delete(cb)
    }
  }
  
  subscribeOnce: EventSubscribersProps<EventsProps>['subscribeOnce'] = (name, cb) => {
    const onceWrapper = ((...args: Parameters<EventsProps[typeof name]>) => {
      cb(...args)
      this.unsubscribe(name, onceWrapper as EventsProps[typeof name])
    }) as EventsProps[typeof name]
    
    return this.subscribe(name, onceWrapper)
  }
  
  publish: EventSubscribersProps<EventsProps>['publish'] = (name, ...args) => {
    if (this.subscribersEvents[name]) {
      const subscribers = Array.from(this.subscribersEvents[name])
      subscribers.forEach((callback) => {
        callback(...args)
      })
    }
  }
  
  resetSubscribers: EventSubscribersProps<EventsProps>['resetSubscribers'] = (name?: keyof EventsProps) => {
    if (name) {
      if (this.subscribersEvents[name]) {
        this.subscribersEvents[name].clear()
      }
    } else {
      const entries = Object.entries(this.subscribersEvents) as [keyof EventsProps, Set<any>][]
      for(const [key] of entries){
        this.subscribersEvents[key]?.clear()
      }
    }
  }
  
  hasSubscribers = (name: keyof EventsProps): boolean => {
    return (this.subscribersEvents[name]?.size ?? 0) > 0
  }
  
  subscriberCount = (name: keyof EventsProps): number => {
    return this.subscribersEvents[name]?.size ?? 0
  }
}