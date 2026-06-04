export class ControlState<T extends { [key: string]: any }> {
  private state = {};
  private defaultState = {};
  public isRejected: boolean = false;
  constructor(state: T) {
    this.state = state;
    this.defaultState = JSON.parse(JSON.stringify(state));
  }
  public setState(state: Partial<T>) {
    this.state = { ...this.state, ...state };
  }
  public getState() {
    return this.state as T;
  }
  public resetState() {
    this.state = this.defaultState;
  }
}
