export interface OptionsConditionReConnect {
  stop: boolean;
}
export interface ConfigInfoConnectI {
  options: OptionsConditionReConnect;
  setConditionReConnect(options: Partial<OptionsConditionReConnect>): void;
}
