import { REACT_TEXT } from "./constant";
import { addEvent } from "./event";
/**
 * 查找vdom对应的真实dom节点
 * 类组件和函数组件本身是没有dom的，只是render或者函数组件的返回值才具有真实dom
 * @param {*} vdom
 * @returns
 */
export function findDOM(vdom) {
  if (!vdom) return null;
  // vdom有dom属性 说明这个vdom是原生组件（span div）等 直接返回对应的真实dom
  if (vdom.dom) return vdom.dom;
  else {
    // 类组件 函数式组件
    const renderVdom = vdom.oldRenderVdom;
    return findDOM(renderVdom);
  }
}
/**
 * 比较两个虚拟节点 vdom -> diff
 * @param {*} parent 父dom节点
 * @param {*} oldVdom 老vdom
 * @param {*} newVdom 新vdom
 */
export function compareToVdom(parent, oldVdom, newVdom) {
  // 获取老的真实dom
  const oldDOM = findDOM(oldVdom);
  // 创建新的真实dom
  const newDOM = createDOM(newVdom);
  parent.replaceChild(newDOM, oldDOM);
}

/**
 * 更新dom节点的属性值
 * @param {*} dom
 * @param {*} oldProps
 * @param {*} newProps
 */
const updateProps = (dom, oldProps = {}, newProps = {}) => {
  for (let key in newProps) {
    if (key === "children") {
    } else if (key === "style") {
      let styleObj = newProps[key];
      for (const attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (/^on[A-Z].*/.test(key)) {
      // 绑定事件  合成事件
      // dom.addEventListener(key.slice(2).toLocaleLowerCase(), newProps[key]);
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      // 普通属性
      dom[key] = newProps[key];
    }
  }
  // 老属性有 新属性没有 需要删除
  for (const key in oldProps) {
    if (!newProps.hasOwnProperty(key)) dom[key] = null;
  }
};
/**
 * 处理子元素是数组的情况
 * @param {*} children
 * @param {*} parentDom
 */
const reconcileChildren = (children, parentDom) => {
  children.forEach((child, index) => {
    mount(child, parentDom);
  });
};
/**
 * 挂载函数式组件
 *
 * 函数式组件的特点：
 * 1. 必须接受一个props对象 并返回一个react元素（vdom）
 * 2. 函数式组件必须首字母大写
 * 3. 先定义后使用
 * 4. 函数式组件 能 且只能 返回一个根节点
 * 5. react元素不但可以是一个DOM标签字符串，也可以是函数
 * @param {*} vdom
 */
const mountFunctionComponent = (vdom) => {
  const { type, props } = vdom;
  // 把属性对象传递给函数执行 返回要渲染的真实dom
  const renderVdom = type(props);
  // 函数式组件的vdom记录自己每次需要返回的老的vdom（子vdom）
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
};
/**
 * 挂载类组件
 * 类组件的数据来源有两个：
 * 1. 父组件传递过来的 属性
 * 2. 组件自身的状态
 * 3. 在类组件里面有些方法的this是绑定为组件实例了 如render
 * @param {*} vdom
 */
const mountClassComponent = (vdom) => {
  const { type, props } = vdom;
  // 创建类组件实例
  const instance = new type(props);
  const renderVdom = instance.render();
  // 把上一次render渲染得到的虚拟dom挂载到组件实例和组件虚拟dom上
  vdom.oldRenderVdom = instance.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
};

/**
 * 虚拟dom转真实dom
 * @param {*} vdom
 */
const createDOM = (vdom) => {
  const { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    // 创建文本节点
    dom = document.createTextNode(props);
  } else if (typeof type === "function") {
    // 区分是函数式组件还是类组件
    if (type.isReactComponent) {
      // 类组件
      return mountClassComponent(vdom);
    }
    return mountFunctionComponent(vdom);
  } else {
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, null, props);
    const children = props.children;
    if (typeof children === "object" && children.type) {
      mount(children, dom);
    } else if (Array.isArray(children)) {
      reconcileChildren(children, dom);
    }
  }
  // 虚拟节点记录真实dom
  vdom.dom = dom;
  return dom;
};
/**
 *
 * @param {*} vdom
 * @param {*} container
 */
const render = (vdom, container) => {
  mount(vdom, container);
};
/**
 * 把虚拟dom转为真实dom
 * @param {*} vdom
 * @param {*} container
 */
const mount = (vdom, container) => {
  const newDOM = createDOM(vdom);
  container.appendChild(newDOM);
};
const ReactDOM = {
  render,
};

export default ReactDOM;
