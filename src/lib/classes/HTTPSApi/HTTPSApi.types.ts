import type { Axios, AxiosResponse } from 'axios';
import { type FetchCommonApiRequest, type RejectRequestInServer_P, type RequestOptions_P, type ResolveRequestInServer_P } from './deps/apiRequest/apiRequest';


export interface FetchCommonPayloadHTTPSApi extends FetchCommonApiRequest, Pick<RejectRequestInServer_P, 'isErr'> {
  isReq: boolean;
  keyAction: string | null;
  isReload: boolean;
}

export interface ResponseErrorHTTPSApi extends FetchCommonPayloadHTTPSApi, Pick<RejectRequestInServer_P, 'msg' | 'errExt'> {}
export interface RequestPayloadHTTPSApi { keyAction: FetchCommonPayloadHTTPSApi['keyAction']; request: { url: string } & RequestOptions_P }

export type FetchInfoHTTPSApi<Result = any> = FetchCommonPayloadHTTPSApi & Pick<RejectRequestInServer_P, 'msg'> & Partial<ResolveRequestInServer_P<Result>> & ResponseErrorHTTPSApi;

export interface HTTPSApi_Events{
  fetch(info: FetchInfoHTTPSApi): void;
} 


// declare global {
//   interface Window{
//     cordova: {
//       plugin: {
//         http: any
//       }
//     }
//   }
// }