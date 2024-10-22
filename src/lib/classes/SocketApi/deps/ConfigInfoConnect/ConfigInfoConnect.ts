import type { ConfigInfoConnectI, OptionsConditionReConnect } from './ConfigInfoConnect.types';

export class ConfigInfoConnect implements ConfigInfoConnectI {
  options = {
    stop: false
  }

  setConditionReConnect = (options: Partial<OptionsConditionReConnect>): void => {
    this.options = {...this.options, ...options};
  }
}
