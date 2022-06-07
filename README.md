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
