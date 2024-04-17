interface OptionsConditionReConnect {
  stop: boolean;
}
interface ConfigInfoConnectI {
  options: OptionsConditionReConnect;
  setConditionReConnect(options: Partial<OptionsConditionReConnect>): void;
}
