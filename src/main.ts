//INFO: HTTPSApi Не верно возвращает данные при ошибке всего лишь

// import { NetworkStatusTracker } from "@lib";

// const networkTicker = new NetworkStatusTracker(['https://tmk.imis.ru/client/']);
// await networkTicker.startEvents((info) => {
//   console.dir(info);
// })
// console.dir(2);

// const internet = new NetworkInformation([new NetworkInformationPC(), new NetworkInformationCordova()]);

// internet.run((status, textStatus) => {
//   console.dir(textStatus);
//   status ? console.dir("online") : console.dir("offline");
// });

// const networkTicker = new NetworkStatusTracker([]);
// const status = await networkTicker.startEvents((info) => {
//   console.dir(info);
// });

// import { Color } from "@lib";

// import { Color } from '@lib';

/*
{
    "isReq": false,
    "isReload": false,
    "keyAction": "login"
}
*/
// window.Color = Color

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

// document.addEventListener("DOMContentLoaded", () => {
//   Array.from({ length: 10 }, () => {
//     const div = document.createElement("div");
//     document.body.style.height = "100vh";
//     const bg = Color.generatePleasantColor({
//       //   saturation: 50, // Увеличиваем насыщенность
//       //   lightness: 90, // Делаем ярче
//       lightness: 95, // Делаем ярче
//       saturation: 65, // Увеличиваем насыщенность
//       hueShift: 0,
//       //   randomize: true
//     });
//     console.log(bg);
//     div.style.backgroundColor = bg;
//     div.style.width = "100%";
//     div.style.marginTop = "5px";
//     div.style.height = "20px";
//     document.body.appendChild(div);
//     //   el.appendChild(div);
//   });
// });
