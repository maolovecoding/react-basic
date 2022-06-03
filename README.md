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
