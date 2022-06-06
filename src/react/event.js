import { updateQueue } from "./component";

/**
 * 合成事件的方法
 * 合成事件 不是原生事件 是我们自己合成的
 * 为什么要合成？
 * 1. 做一个类似于面向切面编程的操作 AOP 在用户自己的handler函数之前做一些其他的事情，在之后做另外的事情
 * 2. 处理浏览器的兼容性 提供兼容所有浏览器的统一API 屏蔽浏览器差异
 * 3. 模拟事件冒泡和阻止冒泡的过程
 * @param {*} dom 绑定事件的真实dom
 * @param {string} eventType
 * @param {*} handler 真实的事件处理函数
 */
export function addEvent(dom, eventType, handler) {
  const store = dom._store || (dom._store = {});
  store[eventType] = handler;
  if (!dispatchEvent[eventType]) document[eventType] = dispatchEvent;
}
/**
 * 派发事件 document身上绑定实际的事件处理函数
 * @param {*} nativeEvent 原生事件 event
 */
function dispatchEvent(nativeEvent) {
  // 批量更新
  updateQueue.isBatchingUpdate = true;
  // type = click 事件类型 target 事件源
  let { type, target } = nativeEvent;
  const eventType = `on${type}`;
  // 创建合成事件
  const syntheticEvent = createSyntheticEvent(nativeEvent);
  while (target) {
    const { _store } = target;
    // const handler = _store&&  _store[eventType]
    _store && _store[eventType] && _store[eventType](syntheticEvent);
    // 阻止冒泡
    if (syntheticEvent.isPropagationStopped) break;
    // 向上冒泡
    target = target.parentNode;
  }
  // 设置批量更新为false 防止出现先更新完父组件 再更新子组件的情况 在批更新的时候提前置为false即可
  // updateQueue.isBatchingUpdate = false;
  updateQueue.batchUpdate(); // 批量更新
}

function createSyntheticEvent(nativeEvent) {
  const syntheticEvent = {};
  for (const key in nativeEvent) {
    let val = nativeEvent[key];
    if (typeof val === "function") val = val.bind(nativeEvent);
    syntheticEvent[key] = val;
  }
  // 合成事件 记录原生事件
  syntheticEvent.nativeEvent = nativeEvent;
  // 当前是否已经阻止冒泡了
  syntheticEvent.isPropagationStopped = false;
  // 阻止冒泡的方法 stopPropagation
  syntheticEvent.stopPropagation = stopPropagation;
  // 阻止默认行为
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.isPreventDefaulted = false;
  return syntheticEvent;
}
/**
 * 阻止冒泡行为
 */
function stopPropagation() {
  const event = this.nativeEvent;
  if (event.stopPropagation) {
    // 标准浏览器
    event.stopPropagation();
  } else {
    // IE
    event.cancelBubble = true;
  }
  // 阻止冒泡了
  this.isPropagationStopped = true;
}

/**
 * 阻止冒泡行为
 */
function preventDefault() {
  const event = this.nativeEvent;
  if (event.preventDefault) {
    // 标准浏览器
    event.preventDefault();
  } else {
    // IE
    event.returnValue = false;
  }
  // 阻止冒泡了
  this.isPropagationStopped = true;
}
