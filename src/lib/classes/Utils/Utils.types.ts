type FilterKey<T> = T extends (infer U)
  ? U extends object 
    ? keyof U 
    : never 
  : never;

export interface UtilsProps {
  events(status: "add" | "remove", who: EventTarget, entriesEvents, msg: string): Promise<string>;
  sortDataByAlphabet(arrData: { [key: string]: any }[], sortKey: string): { [key: string]: any }[];
  getEndsWithArr(arr: any[], countEnd: number): any[];
  deepMerge<T extends object = object>(...itemsOb: T[]): T;
  filterItems<T extends {[key in string]: any}>(list: T[], searchQuery: string, config?: { filterKey?: FilterKey<T> }): T[];
  sortByOnline<T extends { name: string; online: boolean }>(list: T[]): T[];
}
