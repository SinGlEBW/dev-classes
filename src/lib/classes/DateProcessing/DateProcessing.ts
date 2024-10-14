
const itemsMonths = ["Январь", "Февраль","Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"] as const;
const itemsWeek = ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;


export interface DateProcessingI{
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
}



export class DateProcessing {
  static getActiveColorClassInDiffDate:DateProcessingI['getActiveColorClassInDiffDate'] = (date1, date2, activeClass) => {
    let classColorFactCell = '';
    if(date1 && date2){
      let isLess = DateProcessing.hasDateLessPeriod(date1, date2);
      (isLess) && (classColorFactCell = activeClass);
    }
    return classColorFactCell
  }   
  
  static getClassByDifferenceDay:DateProcessingI['getClassByDifferenceDay'] = (date, itemsColors) => {
    let className = '';
    let sortColorsConfig = itemsColors.sort((a, b) => (a.diffDay - b.diffDay));
    for(let i = 0; i < sortColorsConfig.length; i++){
      let itemConfig = sortColorsConfig[i];
     
      const difference = DateProcessing.getDifferenceDates(date, DateProcessing.getCurrentDate());
      if(itemConfig.diffDay < difference){
        className = itemConfig.className;
        break;
      } 
    }
    return className;
  }

  static getMinMaxDate:DateProcessingI['getMinMaxDate'] = (date, minDate, maxDate) => {
    let ob = { minDate: '', maxDate: '', minMaxMonth: ''};
  
    if(/^\d{2}\.\d{2}\.\d{4}$/.test(date) || /^\d{2}\.\d{2}$/.test(date)){
     
      if(!minDate && !maxDate){
        ob.minDate = date;
        ob.maxDate = date;
      }else if(!minDate){
        ob.minDate = date;
        ob.maxDate = (DateProcessing.hasDateLessPeriod(date, maxDate, {dateMinMax: '>='})) ? date : maxDate;
      }else if(!maxDate){
        ob.minDate = (DateProcessing.hasDateLessPeriod(date, minDate, {dateMinMax: '<='})) ? date : minDate;
        ob.maxDate = date;
      } else if(minDate && maxDate){
        ob.minDate = (DateProcessing.hasDateLessPeriod(date, minDate, {dateMinMax: '<='}))  ?  date : minDate;
        ob.maxDate = (DateProcessing.hasDateLessPeriod(date, maxDate, {dateMinMax: '>='}))  ? date : maxDate;
      }
      return { ...ob, ...DateProcessing.minMaxMountStr(ob) }
    }
    console.error('функция getMinMaxDate >> формат дат не соответствует формату: "дд.мм.гггг"');
    return { minDate, maxDate, ...DateProcessing.minMaxMountStr(ob) }
  
    // throw new Error('функция getMinMaxDate >> формат дат не соответствует формату: "дд.мм.гггг"')
  }

  static splitDateFromTime:DateProcessingI['splitDateFromTime'] = (dateTime) => dateTime.split(dateTime.includes('T') ? 'T' : ' ')

  static getCorrectDateAndTime:DateProcessingI['getCorrectDateAndTime'] = (dateTime) => {
    let doubleDot = dateTime.match(/\D/);
    let time, date;

    if(doubleDot && doubleDot[0] === ':'){
      [time, date] = DateProcessing.splitDateFromTime(dateTime);
    }else{
      [date, time] = DateProcessing.splitDateFromTime(dateTime);
    }

    date = DateProcessing.correctionDateAndRemoveYear(date, {isYear: true});
    let chunkTime = time.split(':');
    let isNumberSecond = chunkTime.length === 3;
    if(isNumberSecond){
      chunkTime.length = 2
      time = chunkTime.join(':');
    }
    return [date, time]
  }
  static reverseDate:DateProcessingI['reverseDate'] = (date) => date.split('-').reverse().join('-')

  static correctionDataISO8601:DateProcessingI['correctionDataISO8601'] = (date) => {
    /* INFO: Проверяет корректность даты. Если не "гггг-мм-дд", то переведёт из дд.мм.гггг | дд.мм.гггг чч:мм вариантов*/
    let newDate = '';
    if(DateProcessing.isDateDMY(date)){
      let [d, t] = DateProcessing.splitDateFromTime(date);
      newDate =  d.split(".").reverse().join("-");
    }else if(DateProcessing.isDateISO8601(date)){
      newDate = date 
    }else{
      throw new Error(`функция correctionDataISO8601 >> date не корректна: ${date}. Требуется один из форматов: дд.мм.гггг | дд.мм.гггг мм:чч | гггг-мм-дд `)
    }
    return newDate;
  }

  static isDateDMY:DateProcessingI['isDateDMY'] = (date: string) => /^\d{2}\.\d{2}\.\d{4}$/.test(date) || /^\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2}$/.test(date)
  static isDateISO8601 = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(date)

  static correctionDateAndRemoveYear:DateProcessingI['correctionDateAndRemoveYear'] = (date, options) => {
    //INFO: Переводит число "гггг-мм-дд" в "дд.мм"
    const isYear = !!options?.isYear

    date = DateProcessing.correctionDataISO8601(date);
    let reverseDateArr = date.split('-').reverse();
    let arrTime = reverseDateArr;
    if(!isYear){
      arrTime = reverseDateArr.slice(0,2) 
    }
    return arrTime.join('.')
  }

  static correctionDateWithOutCurrentYear:DateProcessingI['correctionDateWithOutCurrentYear'] = (date, options) => {
    const shortYear = !!options?.shortYear;

    date = DateProcessing.correctionDataISO8601(date);
    const isCurrentYear = +DateProcessing.getChunkFromDate(date, 'year') === +DateProcessing.getChunkFromDate(DateProcessing.getCurrentDate(), 'year');
    
    return (
      isCurrentYear
      ? DateProcessing.correctionDateAndRemoveYear(date, {isYear: !isCurrentYear})  
      : shortYear 
        ? DateProcessing.correctionShortYear(date)
        : DateProcessing.correctionDateAndRemoveYear(date, {isYear: true})
    )
  }

  static correctionShortYear:DateProcessingI['correctionShortYear'] = (date) => {
    const arrChunkDate = DateProcessing.splitDateFromTime(date)[0].split('-').reverse();
    const arrChunkYear = arrChunkDate.splice(-1);
    return `${arrChunkDate.join('.')}.${arrChunkYear[0].slice(2)}`
  }

  static correctionDate:DateProcessingI['correctionDate']  = (date, options) => {
    date = DateProcessing.correctionDataISO8601(date)
    if(options?.isRemoveYear){
      return DateProcessing.correctionDateAndRemoveYear(date);
    }
    if(options?.shortYear){
      return (
        options?.withOutCurrentYear 
        ? DateProcessing.correctionDateWithOutCurrentYear(date, {shortYear: true}) 
        : DateProcessing.correctionShortYear(date)
      )
    }
    
    // return DateProcessing.splitDateFromTime(date)[0]//гггг-мм-дд
    return (
      options?.withOutCurrentYear 
      ? DateProcessing.correctionDateWithOutCurrentYear(date) //дд.мм.?гггг
      : DateProcessing.correctionDateAndRemoveYear(date, {isYear: true})//дд.мм.гггг
    )
  }

  static hasDateLessPeriod:DateProcessingI['hasDateLessPeriod'] = (date, period, option) => {
    const dateMinMax = option?.dateMinMax ? option?.dateMinMax : '<='; 
    date = DateProcessing.correctionDataISO8601(date);
    period = DateProcessing.correctionDataISO8601(period);
    const str = `${Math.floor(Number(new Date(date)))} ${dateMinMax} ${Math.floor(Number(new Date(period)))}`;
    const result = eval(str)
    return result
  }

  static hasDateLessPeriods:DateProcessingI['hasDateLessPeriods'] = (date1, date2, period, option) => {
    return {
      one: DateProcessing.hasDateLessPeriod(date1, period, option),
      two: DateProcessing.hasDateLessPeriod(date2, period, option),
    }
  } 
  
  static getDifferenceDates:DateProcessingI['getDifferenceDates'] = (date1: string, date2:string) => {
    //Разница между date2 и date1 больше или равно переданного числа 
    //"2023-08-31 17:14:48"
    const date1Ob = new Date(DateProcessing.correctionDataISO8601(date1));
    const date2Ob = new Date(DateProcessing.correctionDataISO8601(date2));
  
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2Ob.getTime() - date1Ob.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
  
    return diffInDays; 
  }

  static hasDateLessInNumber:DateProcessingI['hasDateLessInNumber'] = (date1, date2, number) => {
    const diffInDays = DateProcessing.getDifferenceDates(date1, date2,)
    return number <= diffInDays
  }

  static correctionCurrentYear:DateProcessingI['correctionCurrentYear'] = (mmDD, year) => {
    /*  INFO: Передав ['мм-дд'] Если текущая */
    const date = new Date();
    const yearNumber = year ? year : date.getFullYear();
    
    return mmDD.map((period) => {
      const flag = DateProcessing.hasDateLessPeriod(`${year}-${period}`, date.toJSON().split('T')[0], {dateMinMax: '>'})
      return flag ? `${yearNumber - 1}-${period}` : `${year}-${period}`;
    })
  }

  static getChunkFromDate:DateProcessingI['getChunkFromDate'] = (date, chunk, option) => {
    date = DateProcessing.correctionDataISO8601(date);
    
    const chunkDate = date.split('-');
    switch(chunk){
      case 'day': return (!option?.isBeforeZero) ? String(parseInt(chunkDate[2])) : chunkDate[2];
      case 'month': return (!option?.isBeforeZero) ? String(parseInt(chunkDate[1])) : chunkDate[1];
      case 'year': return chunkDate[0];
    }
  }

  static getNameMonthByNumber:DateProcessingI['getNameMonthByNumber'] = (month) => {
    return month > 0 && month < 13 ? itemsMonths[Number(month) - 1] : itemsMonths[0]
  } 

  static minMaxMountStr:DateProcessingI['minMaxMountStr'] = (obMinMaxDate) => {
    return {
      minMaxMonth: DateProcessing.getNameMonthByNumber(
        Number(DateProcessing.getChunkFromDate(obMinMaxDate.minDate, 'month', {isBeforeZero: false}))
      )
      + ' - '
      + DateProcessing.getNameMonthByNumber(
          Number(DateProcessing.getChunkFromDate(obMinMaxDate.maxDate, 'month', {isBeforeZero: false}))
      )
    }
  }

 
  static getDatesToCurrentDate:DateProcessingI['getDatesToCurrentDate'] = (periods) => periods.filter((period) => DateProcessing.hasDateLessPeriod(period, DateProcessing.getCurrentDate()));
 
  static getDayOfWeek:DateProcessingI['getDayOfWeek'] = (date) => {
    let correctDate = DateProcessing.correctionDataISO8601(date)
    const dayOfWeek = new Date(correctDate).getDay();
    return isNaN(dayOfWeek) ? null : itemsWeek[dayOfWeek];
  }
  static cropSecond:DateProcessingI['cropSecond'] = (time) => time.replace(/:\w+$/, '')

  static getRenderDate:DateProcessingI['getRenderDate'] = (date, options) => {
    const withOutCurrentYear = !!options?.withOutCurrentYear;
    const currentDate = DateProcessing.getCurrentDate();
    const difference = DateProcessing.getDifferenceDates(date, currentDate);

    switch (difference) {
      case 0: return 'Сегодня';
      case 1: return 'Вчера';
      case 2: return 'Позавчера';
      default:
        return DateProcessing.correctionDate(date, {shortYear: true, withOutCurrentYear})
    }
  }

  static getCurrentDate:DateProcessingI['getCurrentDate'] = () => {
    const date = new Date();
    const currentYear = DateProcessing.getCurrentYear();
    const currentMonthDay = date.toJSON().split('T')[0].slice(5);
    const currentFullDate = `${currentYear}-${currentMonthDay}`;
    return currentFullDate;
  }
  static getCurrentYear:DateProcessingI['getCurrentYear'] = () => new Date().getFullYear()
  static getDaysInMonth:DateProcessingI['getDaysInMonth'] = (month: number, year: number) => new Date(year, month, 0).getDate();
}

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 





/*-------------------------------------------------------------------------------------------------------------------------------------------*/



