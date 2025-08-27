export class ErrorsHandler{
  handleError(err){
    const errorPayload = { msg: "", statusCode: 0 };
    if ('message' in err) {
      errorPayload.msg = err.message;
    } 
    if ('error' in err) {
      errorPayload.msg = err.error;
    } 
    if('status' in err){
      errorPayload.statusCode = err.status;
    }
    return errorPayload;
  }
  getErrorMessageFromData(status: number, errorData: { [s: string]: string; }){
    let message = "";
    const listKeysError = ["message", "msg", "error", "Message", "Messages", "Error", "Errors"]
    const entriesErrorData = Object.entries<string>(errorData);

    for(let [key, value] of entriesErrorData){
      const is = listKeysError.includes(key);
      if(is){
        message = value;
        break;
      }
    }
  
    return message;
  }
  gerErrorByStatusCordovaHttp(status: number, url: string){
    let message = "";
    if([-1, -4].includes(status)){
      message = 'Нет возможности подключиться к серверу';
    }else 
    if(status === -3){
      message = `Не удается разрешить хост ${url}: Нет адреса, связанного с именем хоста`
    }else
    if(status === -6){
      message = `Нет доступа к сети`
    }
    if(status === -8){
      console.log('download aborted');
    }
    return message;
  }
}