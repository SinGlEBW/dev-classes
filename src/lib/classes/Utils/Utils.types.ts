export interface UtilsProps {
  events (status: 'add' | 'remove', who:EventTarget, entriesEvents, msg: string): Promise<string>;
  sortDataByAlphabet(arrData: {[key: string]: any}[], sortKey: string): {[key: string]: any}[] ;
  sortDataByDate(data:any[], keyDate: string): string[];
  sortDataByDateAndTime(data:any[], keyDate: string): string[];
  reverseDate(datePPR:string):string;
  correctionDataISO8601(date:string):string; 
  hasDateLessPeriod(date: string, period: string, option?:{ dateMinMax: '<=' | '>=' | '<' | '>'; } ): boolean;
  getEndsWithArr(arr: any[], countEnd: number): any[];
  deepMerge<T extends object = object>(...itemsOb: T[]): T
}
