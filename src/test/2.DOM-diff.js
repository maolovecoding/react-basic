import React from "../react";
import ReactDOM from "../react/react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    };
    console.log("AppCounter 1. constructor");
  }
  // 组件将要挂载 还未挂载 此时已经创建好组件实例 但是还未生成需要渲染的vdom（render函数没执行）
  componentWillMount() {
    console.log("AppCounter 2. componentWillMount");
  }

  // 组件已经挂载到页面上
  componentDidMount() {
    console.log("AppCounter 4. componentDidMount");
  }

  // 判断组件是否更新 此时已经有最新的state 但是还未更新到组件实例的state上
  shouldComponentUpdate(nextProps, nextState) {
    console.log("AppCounter 5. shouldComponentUpdate");
    return nextState.counter % 2 === 0;
  }
  // 组件将要更新的生命周期
  componentWillUpdate() {
    console.log("AppCounter 6. componentWillUpdate");
  }
  // 组件将要销毁时触发
  componentWillUnmount() {
    console.log("AppCounter 8. componentWillUnmount");
  }
  // 组件更新完毕
  componentDidUpdate() {
    console.log("AppCounter 7. componentDidUpdate");
  }
  handleClick = (e) => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };
  render() {
    console.log("AppCounter 3. render mount");
    return (
      <div id="counter">
        <h2>counter: {this.state.counter}</h2>
        {this.state.counter === 4 ? null : (
          <ChildCounter counter={this.state.counter} />
        )}
        <div>
          <button onClick={this.handleClick}>+1</button>
        </div>
      </div>
    );
  }
}

class ChildCounter extends React.Component {
  constructor(props) {
    super(props);
    console.log("ChildCounter 1. constructor");
  }
  // 组件将要挂载 还未挂载 此时已经创建好组件实例 但是还未生成需要渲染的vdom（render函数没执行）
  componentWillMount() {
    console.log("ChildCounter 2. componentWillMount");
  }
  componentDidMount() {
    console.log("ChildCounter 4. componentDidMount");
  }
  // 子组件在收到新的props时触发的生命周期 (在组件第一次创建时 不会触发该生命周期 是在更新组件阶段触发)
  componentWillReceiveProps(newProps) {
    console.log(newProps);
    console.log("ChildCounter 5. componentWillReceiveProps");
  }
  // 组件将要销毁时触发
  componentWillUnmount() {
    console.log("ChildCounter 6. componentWillUnmount");
  }
  componentWillUpdate() {
    console.log("ChildCounter 6. componentWillUpdate");
  }
    // 组件更新完毕
    componentDidUpdate() {
      console.log("ChildCounter 7. componentDidUpdate");
    }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("ChildCounter 6. shouldComponentUpdate");
    // 返回true 更新界面 返回false 不更新
    // 界面更新与否 组件的state都会发生改变的
    return nextProps.counter % 3 === 0;
  }
  render() {
    console.log("ChildCounter 3. render mount");
    return <h3 id="childCounter">{this.props.counter}</h3>;
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
