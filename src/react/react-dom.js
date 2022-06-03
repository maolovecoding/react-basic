import { REACT_TEXT } from "./constant";
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
    } else {
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
 * 虚拟dom转真实dom
 * @param {*} vdom
 */
const createDOM = (vdom) => {
  const { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    // 创建文本节点
    dom = document.createTextNode(props);
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
