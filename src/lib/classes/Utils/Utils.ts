import { UtilsProps } from './Utils.types';
//TODO: Почистить

export class Utils {
  static events:UtilsProps['events'] = (status, who, entriesEvents, msg = '') => {
    return new Promise((resolve, reject) => {
      let total = 0;
      for (let [keyEvent, watchEvent] of entriesEvents) {
        total++;
        if(status === 'add'){
          who.addEventListener(keyEvent, watchEvent)
        }else{
          who.removeEventListener(keyEvent, watchEvent)
        }
        (total === entriesEvents.length) && resolve('');
      }
    })
  }
  static sortDataByAlphabet:UtilsProps['sortDataByAlphabet'] = (arrData, sortKey) => {
    return arrData.sort((item1, item2) => (item2[sortKey].trim() < item1[sortKey].trim()) ? 1 : -1)
  }

  static sortDataByDate = (data:any[], keyDate: string) => {
    data.sort((item1, item2) => (Utils.hasDateLessPeriod(item2[keyDate] as string, item1[keyDate] as string) ? 1 : -1));
  }
  
  static sortDataByDateAndTime = (data:any[], keyDate: string) => {
    //data.sort((item1, item2) => (Utils.hasDateLessPeriod(item2[keyDate] as string, item1[keyDate] as string) ? 1 : -1));
  }

  private static splitDateFromTime = (dateTime:string): string[] => dateTime.split(' ');
  static reverseDate = (datePPR) => {
    //INFO: Переводит из  дд.мм.гггг | дд.мм.гггг чч:мм в "гггг-мм-дд" без проверки
    let [date, time] = Utils.splitDateFromTime(datePPR);
    return date.split('.').reverse().join('-');
  }
  
  static correctionDataISO8601 = (date:string):string => {
    /* INFO: Проверяет корректность даты. Если не "гггг-мм-дд", то переведёт из дд.мм.гггг | дд.мм.гггг чч:мм вариантов*/
  
    let newDate = '';
    if(/^\d{2}\.\d{2}\.\d{4}$/.test(date) || /^\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2}$/.test(date)){
      newDate = Utils.reverseDate(date)
    }else if(/^\d{4}-\d{2}-\d{2}$/.test(date)){
      newDate = date 
    // }else if(/^\d{2}-\d{2}$/.test(date)){
    //   newDate = `${currentYear}-${date}`
    }else{
      throw new Error(`функция correctionDataISO8601 >> date не корректна: ${date}. Требуется один из форматов: дд.мм.гггг | дд.мм.гггг мм:чч | гггг-мм-дд `)
    }
  
    return newDate;
  }
  
  static hasDateLessPeriod = (date: string, period: string, option?:{ dateMinMax: '<=' | '>=' | '<' | '>'; } ) => {
    //31.12.2021 00:00
    
    date = Utils.correctionDataISO8601(date);
    period = Utils.correctionDataISO8601(period);
  
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
  static getEndsWithArr = (arr: any[], countEnd) => arr.slice(-countEnd);
  
  static deepMerge = <T extends object = object>(...itemsOb: T[]): T => {
    const payload: any = {};
    const merger = (obj: any) => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          //Точно определяет тип нежели typeof в котором приходиться писать !== null && Array.isArray()
          Object.prototype.toString.call(obj[key]) === "[object Object]" ? (payload[key] = Utils.deepMerge(payload[key], obj[key])) : (payload[key] = obj[key]);
        }
      }
    };
  
    for (let i = 0; i < itemsOb.length; i++) {
      merger(itemsOb[i]);
    }
    return payload;
  };
  static isJSON = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
}
