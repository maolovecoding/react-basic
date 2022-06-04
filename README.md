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
