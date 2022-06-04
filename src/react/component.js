import { findDOM, compareToVdom } from "./react-dom";
// 更新队列
export let updateQueue = {
  isBatchingUpdate: false, // 更新队列中有一个标识 是否要进行批量更新
  updaters: new Set(), // Updater实例的集合 一个实例只需要存在一份即可
  // 批量更新的方法
  batchUpdate() {
    for (const updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    // 重置
    updateQueue.isBatchingUpdate = false;
    // 清空更新集合
    updateQueue.updaters.clear();
  },
};
export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.updater = new Updater(this);
    this.oldRenderVdom = null; // render函数产生的vdom
  }
  /**
   *
   * @param {*} partialState 分状态 部分的state的状态
   */
  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }
  /**
   * 让类组件强制更新 生成新的虚拟dom <--- 就是执行 render
   */
  forceUpdate() {
    // 获取组件实例上次render渲染的vdom
    const oldRenderVdom = this.oldRenderVdom;
    // 获取vdom对应的真实dom
    const oldDOM = findDOM(this.oldRenderVdom);
    const newRenderVdom = this.render();
    compareToVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
  }
}
/**
 * 更新器类 实际更新state的对象在这里
 */
class Updater {
  constructor(classInstance) {
    // 类组件实例
    this.classInstance = classInstance;
    // 等待更新的状态
    this.pendingStates = [];
    // 更新状态后 需要触发的回调
    this.callbacks = [];
  }
  getState() {
    const { classInstance, pendingStates } = this;
    // 先获取老状态
    let { state } = classInstance;
    pendingStates.forEach((partialState) => {
      // setState((state)=>{}) 解决传递的参数是函数的情况
      if (typeof partialState === "function") {
        // 执行的时候 传入老的state
        partialState = partialState(state);
      }
      state = { ...state, ...partialState };
    });
    // 清空分状态数组
    pendingStates.length = 0;
    return state;
  }
  /**
   * state的更新逻辑
   * @param {*} partialState
   */
  addState(partialState, callback) {
    // 记录需要更新的分状态
    this.pendingStates.push(partialState);
    if (typeof callback === "function") {
      this.callbacks.push(callback);
    }
    // 触发更新
    this.emitUpdate();
  }
  emitUpdate() {
    // 批量更新的情况 会把updater记录 等待最后一起更新
    if (updateQueue.isBatchingUpdate) {
      return updateQueue.updaters.add(this);
    }
    // 直接更新
    this.updateComponent();
  }
  updateComponent() {
    const { classInstance, pendingStates } = this;
    if (pendingStates.length) {
      // 有需要更新的分状态
      shouldUpdate(classInstance, this.getState());
    }
    if (this.callbacks.length) {
      this.callbacks.forEach((callback) => callback());
      this.callbacks.length = 0;
    }
  }
}
/**
 *
 * @param {*} classInstance 组件实例
 * @param {*} nextState 需要更新的新状态
 */
function shouldUpdate(classInstance, nextState) {
  // 更新state的值
  classInstance.state = nextState;
  // 强制更新
  classInstance.forceUpdate();
}
