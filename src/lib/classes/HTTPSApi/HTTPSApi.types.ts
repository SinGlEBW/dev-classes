import { type FetchCommonApiRequest, type RejectRequestInServer_P, type RequestOptions_P } from './deps/apiRequest/apiRequest';


export interface FetchCommonPayloadHTTPSApi extends FetchCommonApiRequest, Pick<RejectRequestInServer_P, 'isErr'> {
  isReq: boolean;
  keyAction: string | null;
  isReload: boolean;
}

export type ResponseErrorHTTPSApi = FetchCommonPayloadHTTPSApi & Pick<RejectRequestInServer_P, 'msg' | 'errExt'>;
export type RequestPayloadHTTPSApi = { keyAction: FetchCommonPayloadHTTPSApi['keyAction']; request: { url: string } & RequestOptions_P }


declare global {
  interface Window{
    cordova: {
      plugin: {
        http: any
      }
    }
  }
}