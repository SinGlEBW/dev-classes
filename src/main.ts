//INFO: HTTPSApi Не верно возвращает данные при ошибке всего лишь 
/*
{
    "isReq": false,
    "isReload": false,
    "keyAction": "login"
}
*/


// export const HTTPSApiRequest = <D = any>(payload: Parameters<typeof HTTPSApi["request"]>[0])=> {
//   return new Promise<HTTPSApiRequestReturn<D>>(async (resolve, reject) => {
//     try {
//       console.log('payload by HTTPSApi.request', payload);
//       const { data: result, res, ...meta } = await HTTPSApi.request<D>(payload);
//       console.log('after by result', result);
//       console.log('after by meta', meta);
//       console.log('after by res', res);

//       resolve({data: result, error: '',  meta: { ...meta, msg: 'Успех', response: res } })
//       // if(result){
//       //   resolve(
//       //     {data: result, error: '',  meta: { ...meta, msg: 'Успех', response: res } }
//       //   )
//       // }else{
//       //   reject({ error: 'Нет данных', meta: meta });
//       // }
//     } catch (error) { 
//       console.log("HTTPSApiRequest error", error);
//       const { msg, ...otherErr } = error as ResponseErrorHTTPSApi;
//       reject({ error: msg, meta: { ...otherErr, msg } });
//       return;
//     }
//   });
// }