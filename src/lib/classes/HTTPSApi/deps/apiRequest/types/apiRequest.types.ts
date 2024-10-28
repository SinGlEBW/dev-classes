import { AxiosRequestConfig } from 'axios';


export type RequestOptions_P = Omit<AxiosRequestConfig, 'url'>
export type ItemRequest_P = {url:string, options: RequestOptions_P};
export type RequestUploadToken_F =  (() => Promise<any>);

