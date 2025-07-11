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
  getErrorMessageFromData(errorData: { [s: string]: string; }){
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
}