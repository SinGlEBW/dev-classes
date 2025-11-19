<h3 align="center">SocketApi</h3>
  ### !!! Пакет пепеехал в lib-socket-api !!!
  
<h3 align="center">HTTPSApi</h3>

```ts
import { HTTPSApi, RequestPayloadHTTPSApi } from "dev-classes";

HTTPSApi.init();

HTTPSApi.on('fetch', (info) => { })
HTTPSApi.request({keyAction: 'action1', request: {url: '...'}})

```
<h3 align="center">NetworkInformation</h3>

```ts
import { NetworkInformation, NetworkInformationCordova, NetworkInformationPC } from 'dev-classes';

const internet = new NetworkInformation([new NetworkInformationPC(), new NetworkInformationCordova()]);

internet.run((status, textStatus) => {
  status ? online() : offline();
});

```
<h3 align="center">Color</h3>

```ts

type ColorRgb = [number, number, number];

interface Color_P{
  ColorRgb: ColorRgb;
  ColorRgba: [...ColorRgb, number];
  ColorHsla: Record<"h" | "s" | "l" | "a", number>;
  TypeBrightness_OR:"BT601" | "BT709" | "BT2020"
}

interface ColorProps{
  componentToHex: (c: number) => string;
  rgbToHex(r: number, g: number, b: number): string;
  rgbToHsv(r: number, g: number, b: number): Color_P['ColorRgb'];
  hsvToRgb(h: number, s: number, v: number): Color_P['ColorRgb'];
  rgbaToHsla(r: number, g: number, b: number, a: number): Color_P['ColorHsla'];
  hslaToRgba(h: number, s: number, l: number, a: number): Color_P['ColorRgba'];
  hslaStringToRgba(hsla: string): Color_P['ColorRgba'];
  hexaToRgba(hexa: string, isNormalizeAlpha?: boolean): Color_P['ColorRgba'];
  hexToRgb(hex: string): Color_P['ColorRgb'];
  hexaToHsla(hexa: string): Color_P['ColorHsla'];
  rgbaToHexa(rgba: Color_P['ColorRgba'] | Color_P['ColorRgb'] ): string;
  hslaStringToHexa(hsla: string): string;
  hslaStringToHex(hsla: string): string;
  mixColors(color1: Color_P['ColorRgb'] , color2: Color_P['ColorRgb'], weight: number): Color_P['ColorRgb'];
  getRgbByTypeBrightness(type: Color_P['TypeBrightness_OR']): Color_P['ColorRgb'];
  getAverageColor(color1: Color_P['ColorRgb'], color2: Color_P['ColorRgb']): Color_P['ColorRgb'];
  getAccentColor(baseHsv: number[], baseColor: Color_P['ColorRgb'], elementColor: Color_P['ColorRgb']): Color_P['ColorRgb']
  changeColorAccent(baseHsv: number[], accentHsv: number[], color: Color_P['ColorRgb'], isDarkTheme: boolean): Color_P['ColorRgb'];
  changeBrightness(color: Color_P['ColorRgb'], amount: number): Color_P['ColorRgb'];
  hexBrightness(hex:string, amount: number):string;
  getHexColorFromTelegramColor(color: number): string;  
  getRgbColorFromTelegramColor(color: number): Color_P['ColorRgb'];
  rgbaToRgb(rgba: Color_P['ColorRgba'], bg: Color_P['ColorRgb']): Color_P['ColorRgb'];
  calculateBrightness(rgb: Color_P['ColorRgb'], type?:Color_P['TypeBrightness_OR']): number;
  getTextColor(luminance: number): Color_P['ColorRgb']
  calculateOpacity(luminance: number, targetContrast: number): number;
  clamp(v: number, min: number, max: number): number;
  isHex(color:string):boolean;
  generateHex():string;
  generateHexMultiple(count:number):string[];
}

```
<h3 align="center">DateProcessing</h3>

```ts

interface DateProcessingProps{
  getActiveColorClassInDiffDate(a:string, b:string, c:string):string
  getClassByDifferenceDay(a:string, b:{className:string, diffDay:number}[]):string
  getMinMaxDate(a:string, b:string, c:string):Record<'minDate' | 'maxDate' | 'minMaxMonth', string >
  splitDateFromTime(a:string):string[]
  getCorrectDateAndTime(a:string):[string, string]
  reverseDate(a:string):string
  correctionDataISO8601(a:string):string
  isDateDMY(a:string):boolean
  correctionDateAndRemoveYear(a:string, b?:Partial<{isYear:boolean}>):string
  correctionDateWithOutCurrentYear(a:string, b?:Partial<{shortYear:boolean}>):string
  correctionShortYear(a:string):string
  correctionDate(a:string, b?:Partial<Record<'isRemoveYear'| 'shortYear' | 'withOutCurrentYear', boolean>>):string
  hasDateLessPeriod(a:string, b: string, c?:{dateMinMax: '<=' | '>=' | '<' | '>'}):boolean
  hasDateLessPeriods(a:string, b: string, c:string, d?:{dateMinMax: '<=' | '>=' | '<' | '>'}):Record<'one' | 'two', boolean>
  getDi(a:string, b: string):number
  getDifferenceDates(a:string, b: string):number
  hasDateLessInNumber(a:string, b: string, c:number):boolean
  correctionCurrentYear(a:[string], b?:number):string[]
  getChunkFromDate(a:string, b:'day' | 'month' | 'year', c?:{isBeforeZero:boolean}):string
  getNameMonthByNumber(a:number):(typeof itemsMonths)[number]
  minMaxMountStr(a:Record<'minDate' | 'maxDate', string>): {minMaxMonth: string}
  getDatesToCurrentDate(a:string[]):string[]
  getDayOfWeek(a:string):(typeof itemsWeek)[number] | null
  cropSecond(a:string):string
  getRenderDate(a:string, b?:{withOutCurrentYear: boolean} ):'Сегодня' | 'Вчера' | 'Позавчера' | string 
  getCurrentDate():string 
  getDaysInMonth(a: number, b: number):number 
  getCurrentYear():number 
  getDateDeviation(date: string, config: Partial<Record<"day" | "month" | "year", number>>): string
}

```
<h3 align="center">DelaysPromise</h3>

```ts

interface ControlAction{
  stop(status?: boolean):void; 
  getIsActiveEvent():boolean; 
}
interface  StartActionEveryConfigI {
  interval: number,
  cutoffTime?: number;//4000
  countAction?:number;//example 5
  watchIdInterval?(id:number | null):void;
  controlAction?(control:ControlAction):void
}

interface OneOfPromiseReject{
  status: boolean;
  msg: string;
}


interface DelaysPromiseProps{
   startActionEvery: (cb: () => boolean, config: StartActionEveryConfigI) => {
    stop: ControlAction['stop'],
    promise: Promise<{status: boolean, msg: string}>
  }
  oneOf: (watchPromise: () => Promise<any>, potentialCaseCB: () => void, config: {second: number}) => void
  oneOfPromise:(watchPromise: () => Promise<any>, cbPotentialReject: (p:OneOfPromiseReject) => OneOfPromiseReject, config: {second: number}) => Promise<any>
}

```
<h3 align="center">Number</h3>

```ts

interface NumbersProps {
  randomNumber: () => number;
  getOnlyTheStringNumbers(dirtyString: string): string;
  isNumber(charStr: string | number): boolean;
}

```
<h3 align="center">File</h3>

```ts

import { File } from 'dev-classes';

File.download({
  name: 'test',
  base64: 'test',
  format: 'pdf',
})

```
<h3 align="center">Utils</h3>

```ts

interface UtilsProps {
  events (status: 'add' | 'remove', who:EventTarget, entriesEvents, msg: string): Promise<string>;
  sortDataByAlphabet(arrData: {[key: string]: any}[], sortKey: string): {[key: string]: any}[] ;
  sortDataByDate(data:any[], keyDate: string): string[];
  sortDataByDateAndTime(data:any[], keyDate: string): string[];
  reverseDate(datePPR:string):string;
  correctionDataISO8601(date:string):string; 
  hasDateLessPeriod(date: string, period: string, option?:{ dateMinMax: '<=' | '>=' | '<' | '>'; } ): boolean;
  getEndsWithArr(arr: any[], countEnd: number): any[];
  deepMerge<T extends object = object>(...itemsOb: T[]): T;
  filterItems<T extends Array<{ [key in string]: any } & { name: string }>>(list: T, searchQuery: string): T;
  sortByOnline <T extends Array<{[key in string]: any} & {name: string, online:boolean}>>(list: T):T
}

```
<h3 align="center">NetworkInformation</h3>

```ts

import { NetworkInformation, NetworkInformationPC, NetworkInformationCordova } from 'dev-classes';

const internet = new NetworkInformation([new NetworkInformationPC(), new NetworkInformationCordova()]);

const online = () => {}
const offline = () => {}
internet.run((status) => {
  status ? online() : offline();
});

```
<h3 align="center">EventSubscribers</h3>

```ts

interface EventSubscribersProps<EventsProps>{
  getSubscribers: () => {[K in keyof EventsProps]?: EventsProps[K][]}
  subscribe: <K extends keyof EventsProps>(name: K, cb: EventsProps[K]) => void
  unsubscribe: <K extends keyof EventsProps>(name: K, cb: EventsProps[K]) => void
  publish: <K extends keyof EventsProps>(name: K, data: EventsProps[K] extends (...args: any[]) => any ? Parameters<EventsProps[K]>[0] : any) => void
  resetSubscribers: () => void
}


import { EventSubscribers } from 'dev-classes';

interface CustomEvents{
  myEvent(status: boolean): void;
} 

class MyClass{
  private static events = new EventSubscribers<CustomEvents>(["myEvent"]);
  static on = MyClass.events.subscribe;
  static off = MyClass.events.unsubscribe;

  static runTime(num: number){
    const id = setTimeout(() => {
      let status = true;
      //...
      // if(/*.... */) { status = false; }
      MyClass.events.publish('myEvent', status);
      
      clearTimeout(id);
    }, num * 1000)
  }
}

MyClass.on('myEvent', (status) => {
  console.log(status)
})
MyClass.runTime(2);

```

<h3 align="center">NetworkStatusTracker</h3>

```ts
// Будущая замена NetworkInformation
  const networkTicker = new NetworkStatusTracker([]);
  networkTicker.startEvents((info) => {
    SocketApi.setNetworkStatus(info);
  });
```