import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import Cookies from "js-cookie";
import type { CookieAttributes } from "node_modules/@types/js-cookie";
import { ErrorsHandler } from "./ErrorsHandler/ErrorsHandler";
import { SaveRequest } from "./SaveRequest/SaveRequest";
import { RequestUploadToken_F, type RequestOptions_P } from "./types/apiRequest.types";
import { Utils } from '@classes/Utils/Utils';


export * from "./types/apiRequest.types";


export interface FetchCommonApiRequest {
  statusCode: number;
  url: string;
}

export interface ResolveRequestInServer_P<ResT> extends FetchCommonApiRequest {
  data: ResT;
  res: AxiosResponse<ResT>;
}

export interface RejectRequestInServer_P extends FetchCommonApiRequest {
  isErr: boolean;
  msg: string;
  request: RequestOptions_P;
  errExt?: { 
    code?: string;
    config?: AxiosRequestConfig;
    headers?: object;
    message: string;
    status: number;
    data?:any;
    statusText?: string;
    stack?: string;
  };
}

export class apiRequest {
  private static keyCookie = "AuthCookie";

  private static cookieOptions: CookieAttributes = {};

  private static registerRequest = new SaveRequest();
  private static registerFailedRequests = new SaveRequest();

  private static requestUploadToken: null | RequestUploadToken_F = null;
  private static errorsHandler = new ErrorsHandler();
  static setMethodUploadToken = (cb: RequestUploadToken_F) => {
    apiRequest.requestUploadToken = cb;
  };

  getDecodingError = () => {
    return {
      ERR_BAD_OPTION_VALUE: 'Неправильное значение опции',
      ERR_DEPRECATED: 'Устаревшая функция',
      ERR_INVALID_URL: 'Неверный URL-адрес для запроса axios',
      ECONNABORTED: 'Время ожидания истекло',
      ERR_BAD_REQUEST: 'Usually related to a response with 4xx status code',
      ERR_BAD_RESPONSE: 'Сервер не отвечает',
      ERR_NETWORK: 'Сетевая ошибка',
    }
  }


  static requestInServer = <ResT = any, T extends object = ResolveRequestInServer_P<ResT>>(url: string, options: RequestOptions_P = {}) => {
    return new Promise<T>((resolve, reject: (dataErr: RejectRequestInServer_P) => void) => {
      let payloadSuccess = { url, statusCode: 0, data: {}, res: {} };
  
      const defaultRequestOptions: RequestOptions_P = {
        method: "get",
        headers: {
          cookie: apiRequest.getAuthCookies(),
        },
        timeout: 60000,
      };

      const requestOptions:any = Utils.deepMerge(defaultRequestOptions, options);
  

      const defaultStatus = 520;
      const defaultMessage = "";
      const payloadError: RejectRequestInServer_P = {
        url, 
        statusCode: defaultStatus, 
        msg: defaultMessage, 
        isErr: true, 
        request: requestOptions,
        errExt: { message: defaultMessage, status: defaultStatus } 
      };

      const { cordova } = window as any;
      if (cordova?.cordova && cordova?.plugin?.http) {
        const { http } = cordova?.plugin;
        if('Content-Type' in (requestOptions as any)?.headers){
          if(requestOptions?.headers['Content-Type'] === 'multipart/form-data'){
            http.setDataSerializer("urlencoded");
          }
          if(requestOptions?.headers['Content-Type'] === 'application/json'){
            http.setDataSerializer("json");
          }
        }
        // http.setDataSerializer("json");
        http.setRequestTimeout(Number(requestOptions.timeout) / 1000);

        apiRequest.registerRequest.setList({ url, options: requestOptions });
        http.sendRequest(
          url,
          requestOptions,
          (res) => {
            // console.log("http.sendRequest success: ", res)
            apiRequest.registerFailedRequests.removeItem(url);//проверить что хотел сделать этим
            apiRequest.registerRequest.removeItem(url);
            //INFO: На будуще в set-cookie может не быть token
            const token = res?.headers && res.headers["set-cookie"];
            const statusCode: number = res.status;
            
            const data = Utils.isJSON(res?.data) ? JSON.parse(res?.data) : res?.data;    
            payloadSuccess = { ...payloadSuccess, statusCode, data, res };
            if (statusCode === 200 && token) {
              apiRequest.saveToken(token);
              payloadSuccess.data = { ...payloadSuccess.data, token };
            }
            resolve(payloadSuccess as any);
          },
          (err) => {
          
            const errorsData = apiRequest.errorsHandler.handleError(err);
            const { url, status, headers, error, ...a } = err;
  
            const isJSON = typeof error === "string" ? Utils.isJSON(error.trim()) : false;

            const errExt: RejectRequestInServer_P["errExt"] = { 
              headers,
              status,
              message: "", 
            };

            if(isJSON){
              const parseError = JSON.parse(error.trim());
              const message = apiRequest.errorsHandler.getErrorMessageFromData(status, parseError);
              errExt.message = message;
              errExt.data = parseError;
              errorsData.msg = apiRequest.errorsHandler.gerErrorByStatusCordovaHttp(status, url) 
            }else if(typeof error === "string"){
              errExt.message = error;
            }

            reject({ ...payloadError, ...errorsData, errExt });
          }
        );
      } else {
        apiRequest.registerRequest.setList({ url, options: requestOptions });
        axios({ url, ...requestOptions })
          .then((res) => {
            apiRequest.registerRequest.removeItem(url);
            const statusCode: number = res.status;
            const data = res?.data;
            payloadSuccess = { ...payloadSuccess, statusCode, data, res };
            resolve(payloadSuccess as any);
          })
          .catch((err: AxiosError) => {
            const errorsData = apiRequest.errorsHandler.handleError(err);
            const { code, config, status,  message, response, stack } = err;
            const errExt: RejectRequestInServer_P["errExt"] = { 
              code, 
              config, 
              status: status ? status : defaultStatus,
              message, 
              headers: response?.headers,
              statusText: response?.statusText,
              data: response?.data,
              stack,
            };
            reject({ ...payloadError, ...errorsData, errExt });
          });
      }
    });
  };

  static getAuthCookies = () => {
    const { keyCookie } = apiRequest;
    const { cordova } = window as any
    if (cordova?.plugin?.http) {
      const { http } = cordova?.plugin;
      return http.getCookieString(keyCookie);
    }
    return Cookies.get(keyCookie);
  };

  static saveToken = (token: string) => {
    if (token) {
      const { keyCookie, cookieOptions } = apiRequest;
      const { cordova } = window as any
      if (cordova?.plugin?.http) {
        const { http } = cordova?.plugin;
        http.setCookie(keyCookie, token, cookieOptions);
        return;
      }
      Cookies.set(keyCookie, token, cookieOptions);
    }
  };

  static removeAuthCookie = () => {
    const { keyCookie } = apiRequest;
    const { cordova } = window as any
    if (cordova?.plugin?.http) {
      const { http } = cordova?.plugin;
      http.clearCookies();
      return;
    }
    Cookies.remove(keyCookie);
  };

  static setCookieOptions = (options: CookieAttributes) => {
    apiRequest.cookieOptions = options;
  };

  static setErrorsHandler(errorsHandler: typeof apiRequest.errorsHandler) {
    apiRequest.errorsHandler = errorsHandler;
  }
}
// apiRequest.setErrorsHandler(new ErrorsHandleArm())

// apiRequest.setCookieOptions({
//   domain: REACT_APP_DOMAIN,
//   path: "/",
// });
