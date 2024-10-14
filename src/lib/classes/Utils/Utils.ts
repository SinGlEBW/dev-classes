

export class Utils {
  static events (status: 'add' | 'remove', who, entriesEvents, msg = '') {
    console.log(`##########--------<{ ${status === 'add' ? 'Создаём' : 'Удаляем'} пачку ивентов ${msg}}>---------#########`);
    return new Promise((resolve, reject) => {
      let total = 0;
      // console.log('who ', who);
      for (let [keyEvent, watchEvent] of entriesEvents) {
        total++;
        if(status === 'add'){
          who.addEventListener
          ? who.addEventListener(keyEvent, watchEvent)
          : who.on 
            ? who.on(keyEvent, watchEvent)
            : console.log('Utils.events:>> ', 'Отсутствует метод "addEventListener"');  
        }else{
          who.removeEventListener
          ? who.removeEventListener(keyEvent, watchEvent)
          : who.off
            ? who.off(keyEvent, watchEvent)
            : console.log('Utils.events:>> ', 'Отсутствует метод "removeEventListener"');  
      
        }
      
        (total === entriesEvents.length) && resolve('');
      }
    
    })
  }
  static sortDataByAlphabet = (arrData: {[key: string]: any}[], sortKey: string) => {
    arrData.sort((item1, item2) => (item2[sortKey].trim() < item1[sortKey].trim()) ? 1 : -1)
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
}
