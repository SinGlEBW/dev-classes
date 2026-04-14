export interface EventSubscribersProps<EventsProps extends { [K in keyof EventsProps]: (...args: any[]) => any }> {
  subscribe: <K extends keyof EventsProps>(name: K, cb: EventsProps[K]) => () => void;
  subscribeOnce: <K extends keyof EventsProps>(name: K, cb: EventsProps[K]) => () => void;
  unsubscribe: <K extends keyof EventsProps>(name: K, cb: EventsProps[K]) => void;
  publish: <K extends keyof EventsProps>(name: K, ...args: Parameters<EventsProps[K]>) => void;
  resetSubscribers: <K extends keyof EventsProps>(name?: K) => void;
  getListNameEvents: () => (keyof EventsProps)[];
  getSubscribers: () => { [K in keyof EventsProps]?: Set<EventsProps[K]> };
  hasSubscribers: <K extends keyof EventsProps>(name: K) => boolean;
  subscriberCount: <K extends keyof EventsProps>(name: K) => number;
}
