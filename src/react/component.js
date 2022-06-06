import { findDOM, compareToVdom } from "./react-dom";
// 更新队列
export let updateQueue = {
  isBatchingUpdate: false, // 更新队列中有一个标识 是否要进行批量更新
  updaters: new Set(), // Updater实例的集合 一个实例只需要存在一份即可
  // 批量更新的方法
  batchUpdate() {
    // 设置批量更新为false 防止出现先更新完父组件 再更新子组件的情况 在批更新的时候提前置为false即可
    // 在更新组件之前 先置为false 这样更新父组件的时候 如果需要更新子组件 会先去更新完子组件 再继续更新父组件
    updateQueue.isBatchingUpdate = false;
    for (const updater of updateQueue.updaters) {
      // 组件更新
      updater.updateComponent();
    }
    // 重置
    // updateQueue.isBatchingUpdate = false;
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
    // TODO 生命周期 componentDidUpdate
    if (typeof this.componentDidUpdate === "function") {
      this.componentDidUpdate();
    }
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
  /**
   * 状态发生改变 和属性发生改变 都会走这个方法
   * @param {*} nextProps
   * @returns
   */
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    // 批量更新的情况 会把updater记录 等待最后一起更新
    // 在更新子组件的时候 如果当前还处于批量更新模式 会添加到队列中
    if (updateQueue.isBatchingUpdate) {
      return updateQueue.updaters.add(this);
    }
    // 直接更新
    this.updateComponent();
  }
  updateComponent() {
    const { classInstance, pendingStates, nextProps } = this;
    // 有新属性 或者产生新的状态 都需要走更新逻辑
    if (nextProps || pendingStates.length) {
      // 有需要更新的分状态
      shouldUpdate(classInstance, nextProps, this.getState());
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
function shouldUpdate(classInstance, nextProps, nextState) {
  // 默认情况更新state改变更新组件
  let willUpdate = true;
  // 有该方法且返回值是true或者没有该方法 则更新组件 重新渲染页面
  // TODO 生命周期 shouldComponentUpdate
  if (
    typeof classInstance.shouldComponentUpdate === "function" &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && typeof classInstance.componentWillUpdate === "function") {
    // TODO 生命周期 componentWillUpdate
    classInstance.componentWillUpdate();
  }
  // 更新state的值 更新 props的值
  classInstance.state = nextState;
  if (nextProps) classInstance.props = nextProps;
  if (willUpdate) {
    // 强制更新
    classInstance.forceUpdate();
  }
}
