export class Lodash {
  static filter = (arr, filterArr) => arr.filter(item => !filterArr.includes(item));
  static getItemsID = (items) => items.map((item) => item.id);
} 