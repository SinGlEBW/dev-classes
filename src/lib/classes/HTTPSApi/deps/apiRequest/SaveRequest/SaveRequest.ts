import type { ItemRequest_P } from '../apiRequest';

export class SaveRequest {
  private list: ItemRequest_P[] = [];
  setList = (request: ItemRequest_P) => {
    const { list } = this;
    const isItemRequest = list.some(({ url }) => request.url === url);
    if (!isItemRequest) {
      this.list.push(request);
    }
  };
  getList() {
    return this.list;
  }
  removeItem(url: string) {
    const filterList = this.list.filter((item) => item.url !== url);
    this.list = filterList;
  }
  getLength() {
    return this.list.length;
  }
  getIsItem(url: string) {
    const { list } = this;
    return list.some((item) => item.url === url);
  }
}
