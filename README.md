# react 基础

## 创建项目

```shell
create-react-app react-basic
```

## 更改脚本

把package.json文件的脚本都加上*cross-env DISABLE_NEW_JSX_TRANSFORM=true*。表示禁用新版的**jsx**转换器。
react17以后采用的是新版的转换器。这里学习阶段可以使用经典的jsx转换器。

```json
  "scripts": {
    "start": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts start",
    "build": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts build",
    "test": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts test",
    "eject": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts eject"
  },

```

## 安装 cross-env

```shell
yarn add cross-env -D
npm i cross-env -D
```

## 合成事件和批量更新

### 批量更新

1. 在react中，能被react管理的方法更新是异步的，批量更新的
2. 在react管理不到的地方更新是同步的（比如setTimeout）

### 合成事件

合成事件 不是原生事件 是我们自己合成的。
为什么要合成？

1. 做一个类似于面向切面编程的操作 AOP 在用户自己的handler函数之前做一些其他的事情，在之后做另外的事情
2. 处理浏览器的兼容性 提供兼容所有浏览器的统一API 屏蔽浏览器差异
3. 模拟事件冒泡和阻止冒泡的过程

这里实现的是react15的合成事件原理。
15和17的不同：

1. 最大的不同点就是，15的事件都是代理到document上，17之后都代理给了容器（div#root）了，因为react希望一个页面可以运行多个react版本。

- div#root1 react17
- div#root2 react18

### 安装CRA

#### 支持装饰器

```shell
npm i react-app-rewired customize-cra @babel/plugin-proposal-decorators -D
```

#### 修改package.json的命令

```json
{
  "start": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-app-rewired start",
  "build": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-app-rewired build",
  "test": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-app-rewired test",
  "eject": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-app-rewired eject"
}
```

#### 新键配置文件 config-overrides.js

重写配置文件。

```js
const { override, addBabelPlugin } = require("customize-cra");

module.exports = override(
  addBabelPlugin([
    "@babel/plugin-proposal-decorators",
    {
      // 启用老的模式
      legacy: true,
    },
  ])
);

```

### 高阶组件

高阶组件的用法一般有两种：

1. 属性代理
2. 反向继承

#### 属性代理

```js
import React from "../react";
import ReactDOM from "../react/react-dom";


const withLoading = (message) => (OldComponent) => {
  return class extends React.Component {
    state = {
      show() {
        const div = document.createElement("div");
        div.innerHTML = `
          <p id="loading" style="position:absolute; top:100px; z-index:1; background:#bfa;">${message}</p>
        `;
        document.body.appendChild(div);
      },
      hidden() {
        document.getElementById("loading").remove();
      },
    };
    render() {
      // 给老组件添加了一些额外的属性 state
      return <OldComponent {...this.props} {...this.state} />;
    }
  };
};

// 写法二：装饰器写法
// @withLoading("loading ......")
class App extends React.Component {
  render() {
    return (
      <div>
        <h3>App</h3>
        <button onClick={this.props.show}>show</button>
        <button onClick={this.props.hidden}>hidden</button>
      </div>
    );
  }
}
// 写法一：函数调用先传参 然后返回的函数再传入我们需要进行属性代理的组件
// const WithLoadingApp = withLoading("loading......")(App);
// ReactDOM.render(<WithLoadingApp />, document.querySelector("#root"));
ReactDOM.render(<App />, document.querySelector("#root"));
```

#### 反向继承

当你想改造一个第三方的组件库，又不能去改别人的源代码。可以使用高阶组件进行反向继承

```js
import React from "react";
import ReactDOM from "react-dom";

class Button extends React.Component {
  state = {
    name: "按钮",
  };
  componentWillMount() {
    console.log("button componentWillMount ");
  }
  componentDidMount() {
    console.log("button componentDidMount ");
  }

  render() {
    console.log("button render");
    return (
      <button name={this.state.name} title={this.props.title}>
        按钮
      </button>
    );
  }
}

// 组件增强
const enhancer = (OldComponent) =>
  class extends OldComponent {
    state = {
      number: 0,
    };
    componentWillMount() {
      console.log("enhancer button componentWillMount ");
      super.componentWillMount();
    }
    componentDidMount() {
      console.log("enhancer button componentDidMount ");
      super.componentDidMount();
    }
    handleClick = () => {
      this.setState({
        number: this.state.number + 1,
      });
    };
    render() {
      console.log("enhancer button render");
      const renderElement = super.render();
      const newProps = {
        ...renderElement,
        ...this.state,
        onClick: this.handleClick,
      };
      // 克隆元素 给其新的 props 第三个参数开始 都是其子元素
      return React.cloneElement(renderElement, newProps, this.state.number);
    }
  };
const EnhancerButton = enhancer(Button);
class App extends React.Component {
  render() {
    return (
      <div>
        <h3>App</h3>
        <EnhancerButton title={"我是标题"} />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.querySelector("#root"));

```

#### cloneElement函数实现原理

```js
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
```

## React性能优化和react hooks

### 性能优化

说性能优化，本质就是为了减少渲染次数。

#### render props

本质上都是为了实现逻辑的复用：

- `render props`是指一种在react组件之间使用一个值为函数的 `prop` 共享代码的简单技术
- 具有render prop的组件接收一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑
- render prop 是一个用于告知组件需要渲染什么内容的函数prop
- 这也是逻辑复用的一种方式

```js
import React from "../react";
import ReactDOM from "../react/react-dom";

class MouseTrackerBak extends React.Component {
  state = {
    x: 0,
    y: 0,
  };
  handleMouseMove = (e) => {
    console.log(e.clientX, e.clientY);
    this.setState({
      x: e.clientX,
      y: e.clientY,
    });
  };
  render() {
    return (
      <div
        style={{ background: "#bfa", width: "400px", height: "400px" }}
        onMouseMove={this.handleMouseMove}
      >
        <h3>App</h3>
        <h3>
          鼠标位置：x: {this.state.x} y: {this.state.y}
        </h3>
      </div>
    );
  }
}
/**
 * 这种写法 MouseTracker 类似于公共组件 需要渲染的内容由子组件决定
 * 自己不处理渲染逻辑
 */
class MouseTracker extends React.Component {
  state = {
    x: 0,
    y: 0,
  };
  handleMouseMove = (e) => {
    console.log(e.clientX, e.clientY);
    this.setState({
      x: e.clientX,
      y: e.clientY,
    });
  };
  render() {
    return (
      <div
        style={{ background: "#bfa", width: "400px", height: "400px" }}
        onMouseMove={this.handleMouseMove}
      >
        {/* {this.props.children(this.state)} */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

// ReactDOM.render(
//   <MouseTracker>
//     {(props) => (
//       <div>
//         <h3>App</h3>
//         <h3>
//           鼠标位置：x: {props.x} y: {props.y}
//         </h3>
//       </div>
//     )}
//   </MouseTracker>,
//   document.querySelector("#root")
// );
ReactDOM.render(
  <MouseTracker
    // 也可以作为render属性
    render={(props) => (
      <div>
        <h3>App</h3>
        <h3>
          鼠标位置：x: {props.x} y: {props.y}
        </h3>
      </div>
    )}
  />,
  document.querySelector("#root")
);

```

**高阶组件实现render props**:
高阶组件是React最重要的设计模式之一：是必须掌握的。

```js
import React from "../react";
import ReactDOM from "../react/react-dom";

function withTracker(OldComponent) {
  return class MouseTracker extends React.Component {
    state = {
      x: 0,
      y: 0,
    };
    handleMouseMove = (e) => {
      console.log(e.clientX, e.clientY);
      this.setState({
        x: e.clientX,
        y: e.clientY,
      });
    };
    render() {
      return (
        <div
          style={{ background: "#bfa", width: "400px", height: "400px" }}
          onMouseMove={this.handleMouseMove}
        >
          <OldComponent {...this.state} />
        </div>
      );
    }
  };
}

function Show(props) {
  return (
    <div>
      <h3>App</h3>
      <h3>
        鼠标位置：x: {props.x} y: {props.y}
      </h3>
    </div>
  );
}

const WithTracker = withTracker(Show);

ReactDOM.render(<WithTracker />, document.querySelector("#root"));

```

#### 性能优化手段

说性能优化，本质就是为了减少渲染次数。

1. react PureComponent
2. react memo

### hooks

**Hook 是什么？** Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，useState 是允许你在 React 函数组件中添加 state 的 Hook。

#### useState

- useState 就是一个Hook
- 通过在函数组件里面调用它来给组件添加一些内部的**state**,React会在重复渲染时保留这个state
- useState会返回一对值，当前状态和一个让你更新它状态的函数，可以在事件处理函数或者其他一些地方调用这个函数，它类似于class组件的this.setState函数，但是它不会把新的state和旧的state合并
- useState唯一参数就是初始State
- 返回一个state，以及更新state的函数
  - 在初始渲染期间，返回的状态（state）与传入的第一个参数(initState)值相同
  - setState函数用来更新state，接收一个新的state的值，并将组件的一次重新渲染加入队列

```js
// TODO hooks变量存放位置
const hookStates = []; // 保存hooks状态值
let hookIndex = 0;
let scheduleUpdate; // 调度更新
/**
 *
 * @param {*} vdom
 * @param {*} container
 */
const render = (vdom, container) => {
  mount(vdom, container);
  // 调度更新
  scheduleUpdate = () => {
    hookIndex = 0;
    // 函数组件自身对应的vdom是一样的，但是状态和props可能是不一样的 所有最后生成的renderVdom是不一样的
    compareToVdom(container, vdom, vdom);
  };
};
/**
 * useState hook的实现
 * @param {*} initialState 初始值
 * @returns
 */
export function useState(initialState) {
  // 原来有值（函数组件更新了） 就用已经存在的值 没有则是第一次渲染 用初始值
  hookStates[hookIndex] = hookStates[hookIndex] ?? initialState;
  let currentIndex = hookIndex;
  function setState(newState) {
    // 更新 state
    hookStates[currentIndex] = newState;
    // 触发vdom对比更新
    scheduleUpdate();
  }
  return [hookStates[hookIndex++], setState];
}
```

#### useCallback + useMemo

- 把内联回调函数及其依赖项数组作为参数传入**useCallback**，它将返回该回调函数的memoized版本，该回调函数仅在某个依赖项改变时才会更新
- 把创建函数和依赖数组作为参数传入useMemo，它仅会在某个依赖项改变的时候才重新计算memoized的值。这种优化有助于避免在每次渲染时都进行高开销的计算。
- 类似于Vue的计算属性
- useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。

```js
export function useMemo(factoryFn, deps) {
  // 先判断有没有老的值
  if (typeof hookStates[hookIndex] !== "undefined") {
    const [oldMemo, oldDeps] = hookStates[hookIndex];
    // 判断依赖数组的每一个元素和老的依赖数组中的每一项是否相同
    const same = deps.every((dep, index) => dep === oldDeps[index]);
    if (same) {
      hookIndex++;
      return oldMemo;
    } else {
      const newMemo = factoryFn();
      hookStates[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    const newMemo = factoryFn();
    hookStates[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
export function useCallback(callback, deps) {
  if (typeof hookStates[hookIndex] !== "undefined") {
    const [oldCallback, oldDeps] = hookStates[hookIndex];
    // 判断依赖数组的每一个元素和老的依赖数组中的每一项是否相同
    const same = deps.every((dep, index) => dep === oldDeps[index]);
    if (same) {
      hookIndex++;
      return oldCallback;
    } else {
      hookStates[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    hookStates[hookIndex++] = [callback, deps];
    return callback;
  }
}
```

#### useReducer

useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。（如果你熟悉 Redux 的话，就已经知道它如何工作了。）

```js
/**
 *
 * @param {*} reducer 改变状态的函数
 * @param {*} initialState 初始状态
 */
export function useReducer(reducer, initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] ?? initialState;
  let currentIndex = hookIndex;
  function dispatch(action) {
    hookStates[currentIndex] =
      typeof reducer === "function"
        ? reducer(hookStates[currentIndex], action)
        : // 如果 reducer不是函数 自动转为 useState 那么dispatch函数转为 setState函数 参数是新状态
          action;
    scheduleUpdate();
  }
  return [hookStates[hookIndex++], dispatch];
}
```

**利用useReducer重构useState**：

```js
/**
 * useState hook的实现
 * @param {*} initialState 初始值
 * @returns
 */
export function useState(initialState) {
  // 使用 useReducer重构
  return useReducer(null, initialState);
}
```

**案例：**

```js
import React, { useReducer,useState } from "../../react";
import ReactDOM from "../../react/react-dom";
/**
 * 改变状态state的函数
 * @param {*} state  状态
 * @param {*} action 行为
 * @returns
 */
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { counter: state.counter + 1 };
    case "decrement":
      return { counter: state.counter - 1 };
    default:
      throw new Error();
  }
}
function Counter() {
  // reducer 是一个改变状态的函数 第二个参数是初始值 state
  const [state, dispatch] = useReducer(reducer, { counter: 0 });
  const [number, setNumber] = useState(10);
  // 可以发现 name的值发生改变的情况下 Child组件也会重新渲染 （其实没必要 但是data和函数 所以重新渲染了）
  // 我们希望data在App组件重新渲染的时候，如果number变了 就变成新的data 如果counter没有变化 就返回老data
  return (
    <div>
      <h3>App: {state.counter}</h3>
      <button
        onClick={() => {
          dispatch({ type: "increment" });
        }}
      >
        +1
      </button>
      <button
        onClick={() => {
          dispatch({ type: "decrement" });
        }}
      >
        -1
      </button>
      <h3>number: {number}</h3>
      <button onClick={() => setNumber(number + 10)}>+10</button>
    </div>
  );
}

ReactDOM.render(<Counter />, document.querySelector("#root"));
```

#### useContext

- 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。
- 当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 value prop 决定。
- 当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值。
- useContext(MyContext) 相当于 class 组件中的 static contextType = MyContext 或者 `<MyContext.Consumer>`。
- useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 `<MyContext.Provider>` 来为下层组件提供 context。

```js
function useContext(Context) {
  return Context._currentValue;
}
```

#### useEffect

- 在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。
- 使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道。
- useEffect 就是一个effect hook，给函数组件增加了操作副作用的能力，它跟class组件的componentDidMount、componentDidUpdate，componentWillUnmount具有相同的用途，只不过被合并成了一个API
- 该Hook接收一个包含命令式，且可能有副作用代码的函数

```js
export function useEffect(callback, deps) {
  const currentIndex = hookIndex;
  if (typeof hookStates[hookIndex] !== "undefined") {
    const [oldDestroy, oldDeps] = hookStates[hookIndex];
    const same = deps?.every((dep, index) => dep === oldDeps[index]);
    if (!same) {
      // 开启宏任务 页面渲染后执行回调函数
      setTimeout(() => {
        // 在执行回调之前，先执行上次回调函数的清理函数
        if (typeof oldDestroy === "function") oldDestroy();
        // 执行 callback函数 拿到返回值 销毁函数
        const destroy = callback();
        hookStates[currentIndex] = [destroy, deps];
      });
    }
  } else {
    // 开启宏任务 页面渲染后执行回调函数
    setTimeout(() => {
      // 执行 callback函数 拿到返回值 销毁函数
      const destroy = callback();
      hookStates[currentIndex] = [destroy, deps];
    });
  }
  hookIndex++;
}
```

**需要重构一下useReducer**:

```js
export function useReducer(reducer, initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] ?? initialState;
  let currentIndex = hookIndex;
  function dispatch(action) {
    // 获取老状态
    const oldState = hookStates[currentIndex];
    // 有reducer函数 使用reducer计算新状态
    if (typeof reducer === "function") {
      hookStates[currentIndex] = reducer(oldState, action);
    } else {
      // 判断action是否是函数 如果是 传入的是老状态 计算新状态
      hookStates[currentIndex] =
        typeof action === "function" ? action(oldState) : action;
    }
    scheduleUpdate();
  }
  return [hookStates[hookIndex++], dispatch];
}
```

#### useLayoutEffect + useRef

- 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。
- useEffect 不会阻塞浏览器渲染，而useLayoutEffect会阻塞浏览器渲染
- useEffect 会在浏览器渲染结束之后执行，useLayoutEffect则是在DOM更新完毕后，浏览器绘制之前执行

```js
export function useLayoutEffect(callback, deps) {
  const currentIndex = hookIndex;
  if (typeof hookStates[hookIndex] !== "undefined") {
    const [oldDestroy, oldDeps] = hookStates[hookIndex];
    const same = deps?.every((dep, index) => dep === oldDeps[index]);
    if (!same) {
      // 开启宏任务 页面渲染后执行回调函数
      queueMicrotask(() => {
        // 在执行回调之前，先执行上次回调函数的清理函数
        if (typeof oldDestroy === "function") oldDestroy();
        // 执行 callback函数 拿到返回值 销毁函数
        const destroy = callback();
        hookStates[currentIndex] = [destroy, deps];
      });
    }
  } else {
    // 开启宏任务 页面渲染后执行回调函数
    queueMicrotask(() => {
      // 执行 callback函数 拿到返回值 销毁函数
      const destroy = callback();
      hookStates[currentIndex] = [destroy, deps];
    });
  }
  hookIndex++;
}

export function useRef(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] ?? { current: initialState };
  return hookStates[hookIndex++];
}
```

#### forwardRef + useImperativeHandle

- `forwardRef` 将ref从父组件转发给子组件中的dom元素上，子组件接受props和ref作为参数
- `useImperativeHandle` 可以放你在使用ref时自定义暴露给父组件的实例值
- 在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用：

```js
function useImperativeHandle(ref, factory) {
  ref.current = factory()
}
```
