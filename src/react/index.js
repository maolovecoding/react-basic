import {
  REACT_CONTEXT,
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  REACT_PROVIDER,
} from "./constant";
import { wrapToVDom } from "./utils";
import { Component } from "./component";
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

function createRef() {
  return { current: null };
}
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}

const Children = {
  map(children, mapFn) {
    // 打平二维数组为一维
  },
};
// 实现context
function createContext(initialValue) {
  const context = {
    $$typeof: REACT_CONTEXT,
    _currentValue: initialValue,
  };
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context, // 指向自己
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context,
  };
  return context;
}

function cloneElement(element, newProps, ...newChildren) {
  let children = newChildren.filter((item) => item != null).map(wrapToVDom);
  // 有新的子节点 就用新的覆盖老的 否则 不覆盖
  if (children.length === 0) {
    children = element.props?.children;
  } else if (children.length === 1) children = children[0];
  const props = { ...element.props, ...newProps, children };
  return {
    ...element,
    props,
  };
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Children,
  createContext,
  cloneElement,
};

export default React;
