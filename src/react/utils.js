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
