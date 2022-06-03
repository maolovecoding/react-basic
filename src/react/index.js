import { REACT_ELEMENT } from "./constant";
import { wrapToVDom } from "./utils";
/**
 * 用来创建react元素（虚拟dom）的工厂方法
 * @param {*} type 类型
 * @param {*} config 参数配置
 * @param {*} children 儿子
 */
const createElement = function (type, config, children) {
  let ref, key;
  if (config) {
    ref = config.ref;
    key = config.key;
    delete config.ref;
    delete config.key;
    delete config.__source;
    delete config.__self;
  }
  let props = { ...config };
  // 多个孩子 [c1,c2,...]
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVDom);
  } else {
    props.children = wrapToVDom(children);
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props,
  };
};
const React = {
  createElement,
};

export default React;