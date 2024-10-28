export class ErrorsHandler{
  handleError(err){
    const errorPayload = { msg: "", statusCode: 0 };
    if ('message' in err) {
      errorPayload.msg = err.message;
    } 
    if('status' in err){
      errorPayload.statusCode = err.status;
    }
    return errorPayload;
  }
}