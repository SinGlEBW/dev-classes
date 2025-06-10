import { NetworkInformation } from '@classes/Utils/NetworkInformation/NetworkInformation';
import { apiRequest, RejectRequestInServer_P, type ResolveRequestInServer_P } from './deps/apiRequest/apiRequest';
import type { FetchCommonPayloadHTTPSApi, FetchInfoHTTPSApi, HTTPSApi_Events, RequestPayloadHTTPSApi, ResponseErrorHTTPSApi } from './HTTPSApi.types';
import { NetworkInformationCordova, NetworkInformationPC } from '@classes/Utils/NetworkInformation/classes';
import { EventSubscribers } from '@classes/Utils/EventSubscribers/EventSubscribers';


export class HTTPSApi{
  private static state = {
    isInit: false,
    isNetworkStatus: navigator.onLine,
  };

  private static internet = new NetworkInformation([new NetworkInformationPC(), new NetworkInformationCordova()]);
  private static events = new EventSubscribers<HTTPSApi_Events>(["fetch"]);

  private static setState(state: Partial<typeof HTTPSApi.state>) {
    HTTPSApi.state = { ...HTTPSApi.state, ...state };
  }
  private static getState() {
    return HTTPSApi.state
  }
  private static getIsNetwork() {
    return HTTPSApi.state.isNetworkStatus
  }

  private static online = () => {
    HTTPSApi.setState({ isNetworkStatus: true });
  };
  private static offline = () => {
    HTTPSApi.setState({ isNetworkStatus: false });
  };
  private static errorInit = () => {
    console.error("Не вызван HTTPSApi.init()");
  };
  private static getIsInit = () => {
    const { isInit } = HTTPSApi.getState();
    if (!isInit) {
      HTTPSApi.errorInit();
    }
    return isInit;
  };

  static init = () => {
    
    HTTPSApi.internet.run((status) => {
      status ? HTTPSApi.online() : HTTPSApi.offline();
    });
    HTTPSApi.setState({ isInit: true });
  };

  static on = HTTPSApi.events.subscribe;
  static off = HTTPSApi.events.unsubscribe;

  static request<Result, Req extends RequestPayloadHTTPSApi = RequestPayloadHTTPSApi>(
    { keyAction, request }:Req 
  ):Promise<FetchInfoHTTPSApi<Result>> {
    const { url, ...other } = request;

    return new Promise((resolve, reject) => {
      const isInit = HTTPSApi.getIsInit();
      if(!isInit){
        HTTPSApi.init();
        // throw new Error("Не вызван HTTPSApi.init()");
      }

      const isNetwork = HTTPSApi.getIsNetwork()
  
      const payloadFetch:FetchInfoHTTPSApi<Result> = { 
        url,
        keyAction,
        isErr: !isNetwork,
        msg: isNetwork ? "" : "Нет интернета",
        isReq: isNetwork,
        statusCode: !isNetwork ? 520 : 0,
        isReload: false,
      };
      
   
      
      HTTPSApi.events.publish("fetch", payloadFetch);
      if (isNetwork) {
        apiRequest
          .requestInServer<Result>(url, other)
          .then((response) => {//data, res, statusCode, url
            const successPayload:FetchInfoHTTPSApi<Result> = { 
              isReq: false, isReload: true, isErr: false, keyAction, msg: '', ...response
            }
      
            HTTPSApi.events.publish("fetch", successPayload);
            resolve(successPayload);
          })
          .catch((dataErr: RejectRequestInServer_P) => {
            const errorPayload:ResponseErrorHTTPSApi = { 
              isReq: false, isReload: false, keyAction, ...dataErr, 
            };
            HTTPSApi.events.publish("fetch", errorPayload);
            reject(errorPayload);
          });
        return;
      }
      HTTPSApi.events.publish("fetch", payloadFetch);
      reject(payloadFetch);
    });
  }
  static removeCookie(){
    apiRequest.removeAuthCookie();
  }
}
