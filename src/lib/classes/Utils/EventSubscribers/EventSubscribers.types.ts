export interface EventSubscribersProps<EventsProps>{
  getSubscribers: () => {[K in keyof EventsProps]?: EventsProps[K][]}
  subscribe: <K extends keyof EventsProps>(name: K, cb: EventsProps[K]) => void
  unsubscribe: <K extends keyof EventsProps>(name: K, cb: EventsProps[K]) => void
  publish: <K extends keyof EventsProps>(name: K, data: EventsProps[K] extends (...args: any[]) => any ? Parameters<EventsProps[K]>[0] : any) => void
  resetSubscribers: () => void
}
