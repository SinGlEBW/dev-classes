import { UtilsProps } from "./Utils.types";


export class Utils {
  static events: UtilsProps["events"] = (status, who, entriesEvents, msg = "") => {
    return new Promise((resolve, reject) => {
      let total = 0;
      for (let [keyEvent, watchEvent] of entriesEvents) {
        total++;
        if (status === "add") {
          who.addEventListener(keyEvent, watchEvent);
        } else {
          who.removeEventListener(keyEvent, watchEvent);
        }
        total === entriesEvents.length && resolve("");
      }
    });
  };
  static sortDataByAlphabet: UtilsProps["sortDataByAlphabet"] = (arrData, sortKey) => {
    return arrData.sort((item1, item2) => (item2[sortKey].trim() < item1[sortKey].trim() ? 1 : -1));
  };


  static getEndsWithArr = (arr: any[], countEnd) => arr.slice(-countEnd);

  static deepMerge = <T extends object = object>(...itemsOb: T[]): T => {
    const payload: any = {};
    const merger = (obj: any) => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          //Точно определяет тип нежели typeof в котором приходиться писать !== null && Array.isArray()
          Object.prototype.toString.call(obj[key]) === "[object Object]" ? (payload[key] = Utils.deepMerge(payload[key], obj[key])) : (payload[key] = obj[key]);
        }
      }
    };

    for (let i = 0; i < itemsOb.length; i++) {
      merger(itemsOb[i]);
    }
    return payload;
  };
  static isJSON = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  /**
   * Выполняет фильтрацию массива объектов на основе поискового запроса
   *
   * @param list - Исходный массив данных (должен содержать объекты)
   * @param searchQuery - Строка для поиска (регистронезависимая проверка)
   * @param config - Дополнительные настройки фильтрации
   * @param config.filterKey - Ключ свойства объекта, по которому выполняется поиск
   * @default config.filterKey = 'name'
   *
   * @returns Новый массив, содержащий только элементы, у которых значение
   * по указанному ключу включает поисковую строку
   *
   * @example
   * const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
   * const result = filterList(users, 'john', { filterKey: 'name' });
   * // result: [{ name: 'John', age: 25 }]
   */
  static filterItems: UtilsProps["filterItems"] = (list, searchQuery, config) =>
    list.filter((contact) => (contact[config?.filterKey || "name"] as string).toLowerCase().includes(searchQuery.toLowerCase()));

  static sortByOnline: UtilsProps["sortByOnline"] = (list) => {
    const listOnline: (typeof list)[number][] = [];
    const listOther: (typeof list)[number][] = [];

    for (let i = 0; list.length > i; i++) {
      const item = list[i];
      item.online ? listOnline.push(item) : listOther.push(item);
    }
    const sortListOnline = this.sortDataByAlphabet(listOnline, "name");
    const sortListOther = this.sortDataByAlphabet(listOther, "name");
    return [...sortListOnline, ...sortListOther] as typeof list;
  };
}
