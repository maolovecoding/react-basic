import { REACT_FORWARD_REF, REACT_TEXT, MOVE, PLACEMENT } from "./constant";
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
    // 类组件的需要渲染的vdom在组件实例上 vdom.classInstance.oldRenderVdom
    // 函数式组件的就直接在 vdom.oldRenderVdom上
    const renderVdom = vdom.classInstance
      ? vdom.classInstance.oldRenderVdom
      : vdom.oldRenderVdom;
    return findDOM(renderVdom);
  }
}
/**
 * 比较两个虚拟节点 vdom -> diff
 * @param {*} parent 父dom节点
 * @param {*} oldVdom 老vdom
 * @param {*} newVdom 新vdom
 */
export function compareToVdom(parent, oldVdom, newVdom, nextDOM) {
  // 新旧vdom都是null
  if (!oldVdom && !newVdom) {
    return;
  }
  if (oldVdom && !newVdom) {
    // 需要卸载老节点
    unMountVdom(oldVdom);
  } else if (!oldVdom && newVdom) {
    // 插入新节点
    const newDOM = createDOM(newVdom);
    if (nextDOM) {
      // 有下一个兄弟节点 插在兄弟节点前面
      parent.insertBefore(newDOM, nextDOM);
    } else {
      parent.appendChild(newDOM);
    }
    // TODO 组件挂载生命周期 componentDidMount 在创建的时候放在了dom元素上了
    newDOM.componentDidMount && newDOM.componentDidMount();
  } else if (oldVdom && newVdom) {
    // 新旧节点都存在
    if (oldVdom.type !== newVdom.type) {
      // 1. 新旧节点类型不同
      unMountVdom(oldVdom);
      const newDOM = createDOM(newVdom);
      if (nextDOM) {
        // 有下一个兄弟节点 插在兄弟节点前面
        parent.insertBefore(newDOM, nextDOM);
      } else {
        parent.appendChild(newDOM);
      }
      // TODO 组件挂载生命周期 componentDidMount 在创建的时候放在了dom元素上了
      newDOM.componentDidMount && newDOM?.componentDidMount();
    } else {
      // TODO 新旧节点类型相同 走diff算法
      updateElement(oldVdom, newVdom);
    }
  }
}
/**
 * diff算法 对比新旧虚拟dom
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateElement(oldVdom, newVdom) {
  const currentDOM = (newVdom.dom = findDOM(oldVdom));
  if (oldVdom.type === REACT_TEXT) {
    // 1. 都是文本节点
    if (oldVdom.props !== newVdom.props) {
      // 更新dom的文本内容即可
      currentDOM.textContent = newVdom.props;
    }
  } else if (typeof oldVdom.type === "string") {
    // 是普通元素节点 div a
    // 更新属性
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    // 更新子节点
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "function") {
    // 类组件
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      // 函数式组件
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}
/**
 * 更新类组件
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateClassComponent(oldVdom, newVdom) {
  // 让新的组件的vdom记录组件实例 进行实例的复用
  const instance = (newVdom.classInstance = oldVdom.classInstance);
  // TODO 生命周期 componentWillReceiveProps 组件更新 接收新props时触发
  if (typeof instance.componentWillReceiveProps === "function")
    instance.componentWillReceiveProps(newVdom.props);
  instance.updater.emitUpdate(newVdom.props);
}
/**
 * 更新函数式组件
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateFunctionComponent(oldVdom, newVdom) {
  const parentDOM = findDOM(oldVdom)?.parentNode;
  if (!parentDOM) return;
  const { type, props } = newVdom;
  const newRenderVdom = type(props);
  compareToVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}
/**
 * 对比更新子节点
 * dom diff 原则：
 * 1. 只比较同级的节点 不考虑跨节点层级的移动
 * 2. 相同的类型 生成相同的DOM 不同的类型不能复用
 * @param {*} parentDOM
 * @param {Array|object} oldVChildren
 * @param {Array|object} newVChildren
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  // 过滤空元素
  oldVChildren = oldVChildren.filter((item) => item);
  newVChildren = (
    Array.isArray(newVChildren) ? newVChildren : [newVChildren]
  ).filter((item) => item);
  const keyedOldMap = {};
  // 不需要移动的元素的最大索引
  let lastPlacedIndex = 0;
  oldVChildren.forEach(
    // key : vdom
    (oldVChild, index) => (keyedOldMap[oldVChild.key || index] = oldVChild)
  );
  const patch = [];
  newVChildren.forEach(
    // key : vdom
    (newVChild, index) => {
      const newKey = newVChild.key || index;
      // 找到了老的节点 可以复用
      const oldVChild = keyedOldMap[newKey];
      if (oldVChild) {
        // 更老节点上的属性为最新值
        updateElement(oldVChild, newVChild);
        // 节点移动
        if (oldVChild.mountIndex < lastPlacedIndex) {
          patch.push({
            type: MOVE,
            oldVChild,
            newVChild,
            mountIndex: index,
          });
        }
        delete keyedOldMap[newKey];
        lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex);
      } else {
        // 插入新节点
        patch.push({
          type: PLACEMENT,
          newVChild,
          mountIndex: index,
        });
      }
    }
  );
  // 获取所有需要移动的老节点
  const moveVChild = patch
    .filter((action) => action.type === MOVE)
    .map((action) => action.oldVChild);
  // 把没有复用的老节点 dom节点全部移除
  // 也就是把 需要移动的，需要删除的节点 都先直接删除 这里是从dom树中移除不服用的dom节点
  // 实际上dom元素还是在vdom上保留了引用 可以在下面处理移动的时候在重新插入到dom树中
  Object.values(keyedOldMap)
    .concat(moveVChild)
    .forEach((oldVChild) => {
      const currentDOM = findDOM(oldVChild);
      parentDOM.removeChild(currentDOM);
    });
  // 需要打补丁
  if (patch.length)
    patch.forEach((action) => {
      const { type, oldVChild, newVChild, mountIndex } = action;
      // 这里拿到的子节点dom数组 都是不需要移动的dom
      const childNodes = parentDOM.childNodes;
      let currentDOM;
      if (type === PLACEMENT) {
        // 插入
        currentDOM = createDOM(newVChild);
      } else if (type === MOVE) {
        // 移动 获取dom的引用
        currentDOM = findDOM(oldVChild);
      }
      const childNode = childNodes[mountIndex];
      // if (childNode) {
      //   parentDOM.insertBefore(currentDOM, childNode);
      // } else {
      //   parentDOM.appendChild(currentDOM);
      // }
      // 在 第二个参数 也就是指定插入的节点不存在时  会自动转为 appendChild
      parentDOM.insertBefore(currentDOM, childNode);
    });
}
/**
 * 卸载dom元素
 * @param {*} vdom
 */
function unMountVdom(vdom) {
  const { type, props, ref } = vdom;
  // 获取真实的dom对象
  const currentDOM = findDOM(vdom);
  // TODO 子组件生命周期 componentWillUnmount
  // 类组件的vdom上 具有组件实例对象 卸载组件
  vdom.classInstance?.componentWillUnmount();
  if (ref) {
    ref.current = null;
  }
  // 递归删除子节点
  let children = props.children;
  if (children) {
    children = Array.isArray(children) ? children : [children];
    children.forEach(unMountVdom);
  }
  if (currentDOM) {
    // 卸载自己
    currentDOM.parentNode.removeChild(currentDOM);
  }
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
    child.mountIndex = index;
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
  const { type: ClassComponent, props, ref } = vdom;
  // 创建类组件实例 并且把实例挂载到组件的vdom上
  const instance = (vdom.classInstance = new ClassComponent(props));
  // 让ref.current指向类组件实例
  if (ref) ref.current = instance;
  // TODO 生命周期 componentWillMount
  if (typeof instance.componentWillMount === "function") {
    instance.componentWillMount();
  }
  const renderVdom = instance.render();
  // 把上一次render渲染得到的虚拟dom挂载到组件实例上
  instance.oldRenderVdom = renderVdom;
  // 生成vdom对应的真实dom
  const dom = createDOM(renderVdom);
  if (typeof instance.componentDidMount === "function") {
    // TODO 记录下生命周期（此时dom还未挂载到页面） componentDidMount
    dom.componentDidMount = instance.componentDidMount.bind(instance);
  }
  return dom;
};
/**
 * 给函数式组件返回的vdom添加转发的ref
 * @param {*} vdom 函数组件自身的vdom
 */
const mountForwardComponent = (vdom) => {
  const { type, props, ref } = vdom;
  const renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
};

/**
 * 虚拟dom转真实dom
 * @param {*} vdom
 */
const createDOM = (vdom) => {
  const { type, props, ref } = vdom;
  let dom;
  // 转发ref的高阶函数
  if (type?.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  }
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
      children.mountIndex = 0;
      mount(children, dom);
    } else if (Array.isArray(children)) {
      reconcileChildren(children, dom);
    }
  }
  // 虚拟节点记录真实dom
  vdom.dom = dom;
  // 原生组件ref
  if (ref) ref.current = dom;
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
  if (newDOM) {
    // 组件挂载 元素挂载等
    container.appendChild(newDOM);
    // TODO 执行componentDidMount 对于类组件来说 类组件实例只会在初始化阶段创建 所以只有最开始的dom对象才会记录到当前生命周期
    // 后续更新不会走这一步 因为不管是重新创建dom还是进行diff以后复用dom
    // 重新创建dom不会绑定上组件实例的该生命周期了
    // 复用dom不会再来到这个挂载方法里
    if (typeof newDOM.componentDidMount === "function")
      newDOM.componentDidMount();
  }
};
const ReactDOM = {
  render,
};

export default ReactDOM;
