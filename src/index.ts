import { cloneDeep } from "lodash-es";

interface Item {
  key: string;
  label: string;
  [key: string]: any;
}

type CloneArr = Item[] & {
  setArrValue?: (obj: Record<string, any>) => Item[];
  getArrValue?: () => Record<string, any>;
  setKeyValue?: (key: string, obj: any) => Item[];
  getKeyValue?: (key: string) => any;
  setKeyItem?: (key: string, obj: Item) => Item[];
  addKeyItem?: (obj: Item) => Item[];
  clearValue?: () => Item[];
  setAllItemKey?: (key: string, value: any) => Item[];
  clone?: () => Item[];
  getAll?: () => Item[];
};

/**
 * 将对象中的 value 值，根据 key 值设置到数组对应项中
 * @param obj
 * @returns
 */
function setArrValue(_this: Item[], obj: Record<string, any>): Item[] {
  let objectKeys = Object.keys(obj);
  for (let i = 0; i < _this.length; i++) {
    let item = _this[i];
    if (objectKeys.includes(item.key)) {
      item.value = obj[item.key];
    }
  }
  return _this;
}

/**
 * 获取数组中所有的 value 值 - 没有值的 key 值，value 值为 null
 * @returns
 */
function getArrValue(_this: Item[]): Record<string, any> {
  let obj: Record<string, any> = {};
  for (let i = 0; i < _this.length; i++) {
    let item = _this[i];
    obj[item.key] = item.value || null;
  }
  return obj;
}

/**
 * 根据 key 获取对应的 value
 * @param key
 * @returns
 */
function getKeyValue(_this: Item[], key: string): any {
  let value = null;
  for (let i = 0; i < _this.length; i++) {
    let item = _this[i];
    if (item.key === key) {
      value = item.value;
      break;
    }
  }
  return value;
}

/**
 * 根据 key 设置 key 对应的 value 值
 * @param key
 * @param obj
 * @returns
 * @description 如果 key 值不存在，将不会有任何操作
 */
function setKeyValue(_this: Item[], key: string, obj: any): Item[] {
  let item = _this.find((item) => item.key === key);
  if (item) {
    item.value = obj;
  }
  return _this;
}

/**
 * 根据 key 设置 key 对应的 item 的所有属性，除了 key 值本身,其他的属性都会被覆盖
 * @param key
 * @param obj
 * @returns
 */
function setKeyItem(_this: Item[], key: string, obj: Item): Item[] {
  let itemIndex = _this.findIndex((item) => item.key === key);
  if (itemIndex > -1) {
    _this[itemIndex] = {
      ..._this[itemIndex],
      ...obj,
      key,
    };
  } else {
    _this.push(Object.assign(obj, { key }));
  }
  return _this;
}

class ArrayAction {
  private arr: Item[];
  private callback?: (key: string[]) => void;

  /**
   *
   * @param arr 原始数组对象
   * @param opt 配置项
   */
  constructor(arr: Item[], opt?: { callback?: (key: string[]) => void }) {
    if (!Array.isArray(arr)) {
      throw new Error("arr must be an Array");
    }
    // 防止 arr 被引用后，被修改导致的污染问题
    this.arr = cloneDeep(arr);
    if (opt?.callback) {
      if (typeof opt.callback !== "function")
        throw new Error("callback must be a function");
      this.callback = opt.callback;
    }
  }

  clone(): Item[] {
    let arr: CloneArr = cloneDeep(this.arr) as CloneArr;
    arr.setArrValue = (obj: Record<string, any>) => setArrValue(arr, obj);
    arr.getArrValue = () => getArrValue(arr);
    arr.setKeyValue = (key, obj) => setKeyValue(arr, key, obj);
    arr.getKeyValue = (key: string) => getKeyValue(arr, key);
    arr.setKeyItem = (key: string, obj: Item) => setKeyItem(arr, key, obj);
    arr.addKeyItem = (obj: Item) => {
      arr.push(cloneDeep(obj));
      return arr;
    };
    arr.clearValue = () => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value) arr[i].value = null;
      }
      return arr;
    };
    // 统一设置所有 item 的某个 key 值
    arr.setAllItemKey = (key: string, value: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i][key] = value;
      }
      return arr;
    };
    arr.clone = this.clone.bind(this);
    arr.getAll = () => {
      let newArr = cloneDeep(arr);
      delete newArr.setArrValue;
      delete newArr.getArrValue;
      delete newArr.setKeyValue;
      delete newArr.getKeyValue;
      delete newArr.setKeyItem;
      delete newArr.getAll;
      return newArr as Item[];
    };
    return arr;
  }

  // 持久化某个 key 值的 item 数据，并会影响到后续的 clone
  changeData(key: string, obj: Item): void {
    // 修改原始数据
    this.arr = setKeyItem(this.arr, key, obj);
    // 触发回调
    this.callback && this.callback([key]);
  }

  // 新增数据，如果对应的 key 值已经存在，将会覆盖
  addData(obj: Item): Item[] {
    if (obj === null) {
      return this.arr;
    }
    let keys = Object.keys(obj);
    // 判断 obj 是对象还是数组
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i];
        if (!item.key) {
          continue;
        }
        let index = keys.findIndex((key) => key === item.key);
        if (index > -1) {
          keys.splice(index, 1);
        }
        this.arr = setKeyItem(this.arr, item.key, item);
      }
      // 触发回调
      this.callback && this.callback(keys);
      return this.arr;
    }
    // 对象
    if (obj.key) {
      this.arr = setKeyItem(this.arr, obj.key, obj);
      // 触发回调
      this.callback && this.callback([obj.key]);
    }
    return this.arr;
  }
}

export default ArrayAction;
