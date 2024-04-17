export class ProcessingWS {
  static items:{action: string, reject: typeof Promise.reject }[] = [];
  static push = ({action, reject}) => {
    let isSome = ProcessingWS.items.some((itemSome) => itemSome.action === action)
    if(!isSome){
      ProcessingWS.items.push({action, reject})
    }
  }

  static setResponse = (wsData) => {

    for (let i = 0; i < ProcessingWS.items.length; i++) {
      const element = ProcessingWS.items[i];
      if(wsData.action === element.action){
        element.reject(wsData.mess);
        break;
      }
    }
  }
}