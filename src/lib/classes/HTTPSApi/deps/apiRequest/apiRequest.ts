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
  errExt?: { [key: string]: any };
}

export class apiRequest {
  private static keyCookie = "Token";

  private static cookieOptions: CookieAttributes = {};

  private static registerRequest = new SaveRequest();
  private static registerFailedRequests = new SaveRequest();

  private static requestUploadToken: null | RequestUploadToken_F = null;
  private static errorsHandler = new ErrorsHandler();
  static setMethodUploadToken = (cb: RequestUploadToken_F) => {
    apiRequest.requestUploadToken = cb;
  };

  static requestInServer = <ResT = any, T extends object = ResolveRequestInServer_P<ResT>>(url: string, options: RequestOptions_P = {}) => {
    return new Promise<T>((resolve, reject: (dataErr: RejectRequestInServer_P) => void) => {
      let payloadSuccess = { url, statusCode: 0, data: {}, res: {} };
      const payloadError: RejectRequestInServer_P = { url, statusCode: 520, msg: "", isErr: true, errExt: {} };

      const defaultRequestOptions: RequestOptions_P = {
        method: "get",
        headers: {
          cookie: apiRequest.getToken(),
        },
        timeout: 60000,
      };

      const requestOptions = Utils.deepMerge(defaultRequestOptions, options);
  
      if (window?.cordova && window?.cordova?.plugin?.http) {
        const { http } = window?.cordova?.plugin;

        http.setDataSerializer("json");
        http.setRequestTimeout(Number(requestOptions.timeout) / 1000);

        apiRequest.registerRequest.setList({ url, options: requestOptions });
        http.sendRequest(
          url,
          requestOptions,
          (res) => {
            apiRequest.registerFailedRequests.removeItem(url);
            apiRequest.registerRequest.removeItem(url);
            //INFO: На будуще в set-cookie может не быть token
            const token = res?.headers && res.headers["set-cookie"];
            const statusCode: number = res.status;
            const data = res?.data;
            payloadSuccess = { ...payloadSuccess, statusCode, data, res };
            if (statusCode === 200 && token) {
              apiRequest.saveToken(token);
              payloadSuccess.data = { ...payloadSuccess.data, token };
            }
            resolve(payloadSuccess as any);
          },
          (err) => {
            const errorsData = apiRequest.errorsHandler.handleError(err);

            reject({ ...payloadError, ...errorsData, errExt: err });
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
            reject({ ...payloadError, ...errorsData, errExt: err });
          });
      }
    });
  };

  static getToken = () => {
    const { keyCookie } = apiRequest;
    if (window?.cordova?.plugin?.http) {
      const { http } = window?.cordova?.plugin;
      return http.getCookieString(keyCookie);
    }
    return Cookies.get(keyCookie);
  };

  static saveToken = (token: string) => {
    if (token) {
      const { keyCookie, cookieOptions } = apiRequest;

      if (window?.cordova?.plugin?.http) {
        const { http } = window?.cordova?.plugin;
        http.setCookie(keyCookie, token, cookieOptions);
        return;
      }
      Cookies.set(keyCookie, token, cookieOptions);
    }
  };

  static removeAuthCookie = () => {
    const { keyCookie } = apiRequest;
    if (window?.cordova?.plugin?.http) {
      const { http } = window?.cordova?.plugin;
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
