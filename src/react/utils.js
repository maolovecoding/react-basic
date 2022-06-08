import { REACT_TEXT } from "./constant";
/**
 * 把虚拟dom节点进行包装
 * 如果此虚拟dom是一个文本 比如 字符串 或者 数字 包装成虚拟dom节点对象
 * 如果不是 不改变
 * @param {*} element
 * @returns
 */
export function wrapToVDom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: element }
    : element;
}
/**
 * 两个对象 浅层比较
 * @param {*} obj1
 * @param {*} obj2
 * @returns
 */
export function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  // 基本类型
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  )
    return false;
  // 都是对象 且属性都存在
  const k1 = Object.keys(obj1);
  const k2 = Object.keys(obj2);
  if (k1.length !== k2.length) return false;
  for (const k of k1) {
    // 没有该属性在对象自身上 或者属性值不同
    if (!obj2.hasOwnProperty(k) || obj1[k] !== obj2[k]) {
      return false;
    }
  }
  return true;
}
