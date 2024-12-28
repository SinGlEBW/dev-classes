export const itemsMonths = ["Январь", "Февраль","Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"] as const;
export const itemsWeek = ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;

export interface DateProcessingProps{
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
