//INFO: Привести в порядок
export class DateProcessing {
  static getActiveColorClassInDiffDate = (date1, date2, activeClass) => {
    let classColorFactCell = '';
    if(date1 && date2){
    
      let isLess = DateProcessing.hasDateLessPeriod(date1, date2);
      (isLess) && (classColorFactCell = activeClass);
    }
    return classColorFactCell
  }   
  
  static getClassByDifferenceDay = (date, colorsConfig: {className: string, diffDay: number}[]) => {
  
    let className = '';
    let sortColorsConfig = colorsConfig.sort((a, b) => (a.diffDay - b.diffDay));
    for(let i = 0; i < sortColorsConfig.length; i++){
      let itemConfig = sortColorsConfig[i];
     
      let difference = DateProcessing.hasDateLessInNumber(date, currentFullDate);
      if(itemConfig.diffDay < (difference as number)){
        className = itemConfig.className;
        break;
      } 
    }
    
    return className;
  }
  static getMinMaxDate = (date: string, minDate: string, maxDate: string) => {
  
    let ob = {
      minDate: '',
      maxDate: '',
      minMaxMonth: ''
    };
  
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
      return { ...ob, ...DateProcessing.MinMaxMountStr(ob) }
    }
    console.error('функция getMinMaxDate >> формат дат не соответствует формату: "дд.мм.гггг"');
    return { minDate, maxDate, ...DateProcessing.MinMaxMountStr(ob) }
  
    // throw new Error('функция getMinMaxDate >> формат дат не соответствует формату: "дд.мм.гггг"')
  }

  static splitDateFromTime = (dateTime:string): string[] => {
    const isT = dateTime.includes('T')
    return  dateTime.split(isT ? 'T' : ' ')
  }

  static getCorrectDateAndTime = (dateTime):[date: string, time: string] => {
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
  static reverseDate = (datePPR) => {
    //INFO: Переводит из  дд.мм.гггг | дд.мм.гггг чч:мм в "гггг-мм-дд" без проверки
    let [date, time] = DateProcessing.splitDateFromTime(datePPR);
    return date.split('.').reverse().join('-');
  }
  static correctionDataISO8601 = (date:string):string => {
    /* INFO: Проверяет корректность даты. Если не "гггг-мм-дд", то переведёт из дд.мм.гггг | дд.мм.гггг чч:мм вариантов*/
    let newDate = '';
    if(DateProcessing.isDateDMY(date)){
      newDate = DateProcessing.reverseDate(date)
    }else if(DateProcessing.isDateISO8601(date)){
      newDate = date 
    }else{
      throw new Error(`функция correctionDataISO8601 >> date не корректна: ${date}. Требуется один из форматов: дд.мм.гггг | дд.мм.гггг мм:чч | гггг-мм-дд `)
    }
    return newDate;
  }

  static isDateDMY = (date: string) => { //ITM-EN 28601 | NBN Z 01-002
    //INFO: Проверка соответствует ли дата дд.мм.гггг | дд.мм.гггг чч:мм 
    if(/^\d{2}\.\d{2}\.\d{4}$/.test(date) || /^\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2}$/.test(date)){
      return true
    }else{
      return false
    }
  }
  static isDateISO8601 = (date: string) => {
    if(/^\d{4}-\d{2}-\d{2}$/.test(date) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(date)){
      return true
    }else{
      return false
    }
  }
  static correctionDateAndRemoveYear = (datePPR: string, options = {isYear: false}) => {
    //INFO: Переводит число "гггг-мм-дд" в "дд.мм"
    datePPR = DateProcessing.correctionDataISO8601(datePPR);
    let reverseDateArr = datePPR.split('-').reverse();
    let arrTime = reverseDateArr;
    if(!options.isYear){
      arrTime = reverseDateArr.slice(0,2) 
    }
    return arrTime.join('.')
  }

  static correctionDateWithOutCurrentYear = (date: string, options?:{shortYear: boolean}) => {
    date = DateProcessing.correctionDataISO8601(date);
    const isCurrentYear = +DateProcessing.getChunkFromDate(date, 'year') === currentYear;
    // 
    return (
      isCurrentYear
      ? DateProcessing.correctionDateAndRemoveYear(date, {isYear: !isCurrentYear})  
      : options?.shortYear 
        ? DateProcessing.correctionShortYear(date)
        : DateProcessing.correctionDateAndRemoveYear(date, {isYear: true})
    )
  }

  static correctionShortYear = (date:string) => {
    let arrChunkDate = DateProcessing.splitDateFromTime(date)[0].split('-').reverse();
    let arrChunkYear = arrChunkDate.splice(-1);
    return `${arrChunkDate.join('.')}.${arrChunkYear[0].slice(2)}`
  }

  static correctionDate = (date: string, options?: Partial<Record<'isRemoveYear'| 'shortYear' | 'withOutCurrentYear', boolean>>) => {
    //INFO: 
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

  static hasDateLessPeriod = (date: string, period: string, option?:{ dateMinMax: '<=' | '>=' | '<' | '>'; } ) => {
    //31.12.2021 00:00
    
    date = DateProcessing.correctionDataISO8601(date);
    period = DateProcessing.correctionDataISO8601(period);
  
    //TODO: написать проверку на получаемую дату. date должна передаваться в формате дд.мм.гггг и её я переворачиваю в гггг-мм-дд
    if(!option || (option && !option.dateMinMax) || option?.dateMinMax === '<='){
      return Math.floor(Number(new Date(date))) <= Math.floor(Number(new Date(period)))
    }
    if(option && option?.dateMinMax === '>='){
      return Math.floor(Number(new Date(date))) >= Math.floor(Number(new Date(period)))
    }
    if(option && option?.dateMinMax === '<'){
      return Math.floor(Number(new Date(date))) < Math.floor(Number(new Date(period)))
    }
    if(option && option?.dateMinMax === '>'){
      return Math.floor(Number(new Date(date))) > Math.floor(Number(new Date(period)))
    }
  
    // return (!option || option?.dateMinMax === '<=')
    // ? Math.floor(Number(new Date(date))) <= Math.floor(Number(new Date(period)))
    // : Math.floor(Number(new Date(date))) >= Math.floor(Number(new Date(period)))
  }
  static hasDateLessPeriodV2 = (date1: string, date2:string,  period: string, option?:{ dateMinMax: '<=' | '>=' | '<' | '>'; } ) => {
    return {
      one: DateProcessing.hasDateLessPeriod(date1, period, option),
      two: DateProcessing.hasDateLessPeriod(date2, period, option),
    }
  } 
  static hasDateLessInNumber = (date1: string, date2:string, number?: number ) => {
    //Разница между date2 и date1 больше или равно переданного числа 
    //"2023-08-31 17:14:48"
    const date1Ob = new Date(DateProcessing.correctionDataISO8601(date1));
    const date2Ob = new Date(DateProcessing.correctionDataISO8601(date2));
  
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2Ob.getTime() - date1Ob.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
  
   if(number){
     return number <= diffInDays; 
   }
    return diffInDays; 
  }

  static correctionCurrentYear = (periods, Year?: number) => {
    /* 
      INFO: Передав ['мм-дд'] Если текущая 
    */
    const date = new Date();
    const year = Year ? Year : date.getFullYear();
    
    return periods.map((period) => {
      const flag = DateProcessing.hasDateLessPeriod(`${year}-${period}`, date.toJSON().split('T')[0], {dateMinMax: '>'})
      return flag ? `${year - 1}-${period}` : `${year}-${period}`;
  
    })
  }

  static correctionCurrentDate = (date) => {
    /* INFO: */
    let year = new Date().getFullYear();
    return DateProcessing.correctionDate(date, {isRemoveYear:  true, shortYear: true})
    // return correctionDate(date, {isRemoveYear:  Number(getChunkFromDate(date, "year")) === year, shortYear: true})
  }

  static getMinMaxDateV2 = (date: string, obMinMaxDate) => {
    date = date.split(' ')[0]
  
  
    if(DateProcessing.isDateDMY(date)){
     
      if(!obMinMaxDate.minDate && !obMinMaxDate.maxDate){
  
        obMinMaxDate.minDate = date;
        obMinMaxDate.maxDate = date;
  
      }else if(!obMinMaxDate.minDate){
    
        obMinMaxDate.minDate = date;
        obMinMaxDate.maxDate = (DateProcessing.hasDateLessPeriod(date, obMinMaxDate.maxDate, {dateMinMax: '>='})) ? date : obMinMaxDate.maxDate;
      
      }else if(!obMinMaxDate.maxDate){
       
        obMinMaxDate.minDate = (DateProcessing.hasDateLessPeriod(date, obMinMaxDate.minDate, {dateMinMax: '<='})) ? date : obMinMaxDate.minDate;
        obMinMaxDate.maxDate = date;
       
      } else if(obMinMaxDate.minDate && obMinMaxDate.maxDate){
        
        obMinMaxDate.minDate = (DateProcessing.hasDateLessPeriod(date, obMinMaxDate.minDate, {dateMinMax: '<='}))  ?  date : obMinMaxDate.minDate;
        obMinMaxDate.maxDate = (DateProcessing.hasDateLessPeriod(date, obMinMaxDate.maxDate, {dateMinMax: '>='}))  ? date : obMinMaxDate.maxDate;
      }
    }
    
    obMinMaxDate.minMaxMonth = DateProcessing.MinMaxMountStr(obMinMaxDate).minMaxMonth;

    // throw new Error('функция getMinMaxDate >> формат дат не соответствует формату: "дд.мм.гггг"')
  }
  static getChunkFromDate = (date: string, getChunk: 'day' | 'month' | 'year', option?:{isBeforeZero:boolean}) => {

    date = DateProcessing.correctionDataISO8601(date);
    const chunkDate = date.split('-');
    switch(getChunk){
      case 'day': return (!option?.isBeforeZero) ? chunkDate[0].slice(-1) : chunkDate[2];
      case 'month': return (!option?.isBeforeZero) ? chunkDate[1].slice(-1) : chunkDate[1];
      case 'year': return chunkDate[0];
    }
  }

  static convertMonthNumberInName = (month):string => {
    const monthNumberInName = ["Январь", "Февраль","Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    return month ? monthNumberInName[Number(month) - 1] : '----';
  } 
  static MinMaxMountStr = (obMinMaxDate) => {
    return {
      minMaxMonth: DateProcessing.convertMonthNumberInName(DateProcessing.getChunkFromDate(obMinMaxDate.minDate, 'month', {isBeforeZero: false}))
      + ' - '
      + DateProcessing.convertMonthNumberInName(DateProcessing.getChunkFromDate(obMinMaxDate.maxDate, 'month', {isBeforeZero: false}))
    }
  }
  static sortDataByAlphabet = (arrData) => {
    arrData.sort((item1, item2) => (item2.name.trim() < item1.name.trim()) ? 1 : -1)
  }
  static getEndsWithArr = (arr: any[], countEnd) => arr.slice(-countEnd);
  static filterPeriodsRelativeCurrentDate = (periods: string[]) => periods.filter((period) => DateProcessing.hasDateLessPeriod(period, currentFullDate));
 
  static getCollectionPeriodsFullDate = (collectionPeriodsDate, reqYear) => collectionPeriodsDate.map((period) => (`${reqYear}-${period}`));

  static sortDataByDate = (data:any[], keyDate: string) => {
    data.sort((item1, item2) => (DateProcessing.hasDateLessPeriod(item2[keyDate] as string, item1[keyDate] as string) ? 1 : -1));
  }
  static getNameKeyByNumber = (data) => {
    let keys:string[] = [];
    for (let i = 0; i < data.length; i++) {
      for(let [key, value] of Object.entries(data[i])){
        typeof value === 'number' && (!key.length || !keys.some((itemKey) => itemKey === key)) &&
          keys.push(key)
      }
    }
    return keys;
  }
  static getDayOfWeek(date) {
    let correctDate = DateProcessing.correctionDataISO8601(date)
    const dayOfWeek = new Date(correctDate).getDay();
    
    return isNaN(dayOfWeek) ? null :
      ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][dayOfWeek];
  }
  static cropSecond = (time) => {
    return time.replace(/:\w+$/, '')
  }
  static getCurrentDate = () => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonthDay = date.toJSON().split('T')[0].slice(5);
    const currentFullDate = `${currentYear}-${currentMonthDay}`;
    return currentFullDate;
  }
  static getRenderDate = (date:string, option: {withOutCurrentYear: boolean} = {withOutCurrentYear: false}) => {
 
    const currentDate = DateProcessing.getCurrentDate();

    if(date === currentDate){
      return 'Сегодня';
    }
    
    const difference = DateProcessing.hasDateLessInNumber(date, currentDate);
    if(difference === 1){
      return 'Вчера'
    }
    if(difference === 2){
      return 'Позавчера'
    }
    console.dir(date);
    const a = DateProcessing.correctionDate(date, {shortYear: true, withOutCurrentYear: option.withOutCurrentYear })
    console.dir(a);
    return a

  }
}

(window as any).DateProcessing = DateProcessing;
/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 
const date = new Date();
export const currentYear = date.getFullYear();
export const currentMonthDay = date.toJSON().split('T')[0].slice(5);
export const currentFullDate = `${currentYear}-${currentMonthDay}`;
export let yearRange = `${currentYear} - ${currentYear + 1}`;
export const randomNumber = () => Math.floor(Math.random() * date.getTime())


/*-------------------------------------------------------------------------------------------------------------------------------------------*/



