import type { ConfigInfoConnectI, OptionsConditionReConnect } from './ConfigInfoConnect.types';

export class ConfigInfoConnect implements ConfigInfoConnectI {
  options = {
    stop: false
  }

  setConditionReConnect = (options: Partial<OptionsConditionReConnect>): void => {
    console.log('Переданные параметры (setConditionReConnect)', options);
    console.log('this.options', this.options);
    this.options = {...this.options, ...options};
  }
}
