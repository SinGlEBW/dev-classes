import { apiRequest, RejectRequestInServer_P, type ResolveRequestInServer_P } from './deps/apiRequest/apiRequest';
import type { FetchCommonPayloadHTTPSApi, RequestPayloadHTTPSApi, ResponseErrorHTTPSApi } from './HTTPSApi.types';
export * from './HTTPSApi.types';


export class HTTPSApi{
  private static options = {
    getIsNetwork: () => true,
    setStatusFetch: (req) => {req.keyAction == ''},
  }

  static setOptions(options: Partial<typeof HTTPSApi.options>) {
    HTTPSApi.options = { ...HTTPSApi.options, ...options }
  }

  static request<Result, Req extends RequestPayloadHTTPSApi = RequestPayloadHTTPSApi>(
    { keyAction, request }:Req 
  ):Promise<FetchCommonPayloadHTTPSApi & ResolveRequestInServer_P<Result>> {
    const { url, ...other } = request;

    return new Promise((resolve, reject) => {
      const { getIsNetwork, setStatusFetch } = HTTPSApi.options;
      const isNetwork = getIsNetwork()
  
      const payloadFetch:FetchCommonPayloadHTTPSApi & Pick<RejectRequestInServer_P, 'msg'> = { 
        url,
        keyAction,
        isErr: !isNetwork,
        msg: isNetwork ? "" : "Нет интернета",
        isReq: isNetwork,
        statusCode: 520,
        isReload: false
      };
      
      setStatusFetch(payloadFetch)
      if (isNetwork) {
        apiRequest
          .requestInServer<any>(url, other)
          .then((response) => {//data, res, statusCode, url
            const successPayload:FetchCommonPayloadHTTPSApi & ResolveRequestInServer_P<Result> = { 
              isReq: false, isReload: true, isErr: false, keyAction, ...response
            }
            setStatusFetch(successPayload);
            resolve(successPayload);
          })
          .catch((dataErr: RejectRequestInServer_P) => {
            const errorPayload:ResponseErrorHTTPSApi = { 
              isReq: false, isReload: false, keyAction, ...dataErr, 
            };
           
            setStatusFetch(errorPayload);
            reject(errorPayload);
          });
        return;
      }

      setStatusFetch(payloadFetch)
      reject(payloadFetch);
    });
  }
  static removeCookie(){
    apiRequest.removeAuthCookie();
  }
}

