interface  StartActionEveryConfigI {
  interval: number,
  cutoffTime?: number;//4000
  countAction?:number;//example 5
  watchIdInterval?(id:number | null):void;
  controlAction?(control:{ stop():void, getIsActiveEvent():boolean }):void
}
type Callback = () => boolean;
type StartActionEveryType = (cb: Callback, config: StartActionEveryConfigI) => Promise<{status: boolean, msg: string}>

export class DelaysPromise{

  startActionEvery:StartActionEveryType = (cb, config = { interval: 5000 }) => {
    const setId = (id) => {
      typeof config?.watchIdInterval === "function" &&  config?.watchIdInterval(id);
    };

    const controlAction = (control) => {
      typeof config?.controlAction === "function" && config?.controlAction(control)
    };
 
    return new Promise((resolve, reject) => {
      /*
        INFO: interval - переодичность с которой отрабатывает cb до тех пор пока cb не вернёт true
                         и тогда отработает then.

              rejectCutoff - в случае заданного interval мы ждём когда вернёт cb true, этот параметр задаёт отсечку по времени
                             спустя которое cb перестанет вызываться даже если true не будет. Отработает в таком случае reject
                             
      */

      let countInterval = 0;
      let countAction = 0;
      const options = {
        isActive: true
      }

      const idInterval = setInterval(
        () => {
          countInterval += config.interval;
          countAction += 1;
          if ((config?.cutoffTime && countInterval > config.cutoffTime) || (config?.countAction && config?.countAction < countAction)) {
            options.isActive = false;
            clearInterval(idInterval);
            setId(null);
            reject({ status: false, msg: Error(`Время загрузки истекло`) });
            return;
          }

          const stop = cb();
          if (stop) {
            options.isActive = false;
            clearInterval(idInterval);
            setId(null);
            resolve({ status: true, msg: "cb вернул true" });
          }
        },
        config.interval < 200 ? 200 : config.interval
      );
      setId(idInterval);
      controlAction({
        getIsActiveEvent: () => options.isActive,
        stop: () => {
          const msg =  "Ручное завершение startActionEvery"
          console.dir(`controlAction (stop): ${msg}`);
          options.isActive = false;
          clearInterval(idInterval);
          setId(null);
          resolve({ status: true, msg });
        }
      })
    });
  }
  
  oneOf = (promiseWatch, potentialCaseCB, {second}) => {
    /*
      INFO: 
      promiseWatch - промис который должен сработать в течении (second) времени.
      potentialCaseCB - cb который вызывается спустя время (second) при условии если промис promiseWatch не отработал
    */
    let isResponce = 1;
    promiseWatch()
    .then(() => { 
      (isResponce === 1) && (isResponce = 0);
    })
  
    let idInterval = setInterval(() => { console.dir('setInterval в oneOf');
      if(isResponce === 1){ potentialCaseCB(); }
      clearInterval(idInterval);
    }, second * 1000);
    
  }  

  oneOfPromise = (promiseWatch, cbPotentialReject, {second}) => 
    new Promise((resolve, reject) => {

     
      /*
        INFO: 
        promiseWatch - промис который должен сработать в течении (second) времени.
        potentialCaseCB - cb который вызывается спустя время (second) при условии если промис promiseWatch не отработал
                          potentialCaseCB должна вернуть объект который будет передан в reject
      */

      let isResponce = 1;
      let errPayload = {status: false, msg: '',}
      promiseWatch()
      .then((data) => { console.log('DelaysPromise.oneOfPromise (promiseWatch ==> data)', data);
        if(isResponce === 1) {
          isResponce = 0;
          resolve(data);
        }
      })
      .catch((err) => { 
        if(isResponce === 1) {
          isResponce = 0;
          errPayload.msg = err
          reject(err);
        }
      })
    
      let idInterval = setInterval(() => { console.log('DelaysPromise.oneOfPromise (interval ==> potentialCaseCB)', );
        if(isResponce === 1){ 
          isResponce = 0;
          if(typeof cbPotentialReject === 'function'){
            reject({status: false, msg: '', ...cbPotentialReject(errPayload)})
            return;
          }
          reject({status: false, msg: 'oneOfPromise reject'});
        }
        clearInterval(idInterval);
      }, second * 1000);
  })

 
}