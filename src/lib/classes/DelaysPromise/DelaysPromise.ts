
import { DelaysPromiseProps, ControlAction } from "./DelaysPromise.types";

export class DelaysPromise{
  private defaultProps = {
    interval: 5000
  }

  startActionEvery:DelaysPromiseProps['startActionEvery'] = (cb, config = this.defaultProps) => {
    const setId = (id) => {
      config?.watchIdInterval && config?.watchIdInterval(id);
    }

    const controlAction = (control: ControlAction) => {
      config?.controlAction && config?.controlAction(control)
    };
 
    return new Promise((resolve, reject) => {
      /*
        INFO: interval - переодичность с которой отрабатывает cb до тех пор пока cb не вернёт true
                         и тогда отработает then.

              cutoffTime - в случае заданного interval мы ждём когда вернёт cb true, этот параметр задаёт отсечку по времени
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

          const isStop = cb();
          if (isStop) {
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
        stop: (status) => {
          const msg = "Ручное завершение startActionEvery" 
          options.isActive = false;
          clearInterval(idInterval);
          setId(null);
          status  
          ? resolve({ status, msg: msg + ': (true)' })
          : reject({ status, msg: msg + ': (false)' }) 
        }
      })
    });
  }
  
  oneOf:DelaysPromiseProps['oneOf'] = (promiseWatch, potentialCaseCB, {second}) => {
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
  
    let idInterval = setInterval(() => { 
      if(isResponce === 1){ potentialCaseCB(); }
      clearInterval(idInterval);
    }, second * 1000);
    
  }  

  oneOfPromise:DelaysPromiseProps['oneOfPromise'] = (promiseWatch, cbPotentialReject, {second}) => 
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
      .then((data) => { 
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
    
      let idInterval = setInterval(() => { 
        if(isResponce === 1){ 
          isResponce = 0;
          if(typeof cbPotentialReject === 'function'){
            reject({status: false, msg: '', ...cbPotentialReject(errPayload) as any})
            return;
          }
          reject({status: false, msg: 'oneOfPromise reject'});
        }
        clearInterval(idInterval);
      }, second * 1000);
  })

}