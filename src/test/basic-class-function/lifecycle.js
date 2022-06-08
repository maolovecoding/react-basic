import React from "../react";

class Lifecycle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    };
    console.log("Lifecycle 1. constructor");
  }
  // 组件将要挂载 还未挂载 此时已经创建好组件实例 但是还未生成需要渲染的vdom（render函数没执行）
  componentWillMount() {
    console.log("Lifecycle 2. componentWillMount");
  }
  handleClick = (e) => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };
  render() {
    console.log("Lifecycle 3. render mount");
    return (
      <div>
        <h3>counter: {this.state.counter}</h3>
        <button onClick={this.handleClick}>+1</button>
      </div>
    );
  }
  // 组件已经挂载到页面上
  componentDidMount() {
    console.log("Lifecycle 4. componentDidMount");
  }

  // 判断组件是否更新 此时已经有最新的state 但是还未更新到组件实例的state上
  shouldComponentUpdate(nextProps, nextState) {
    console.log("Lifecycle 5. shouldComponentUpdate");
    // 返回true 更新界面 返回false 不更新
    // 界面更新与否 组件的state都会发生改变的
    return nextState.counter % 2 === 0;
  }
  // 组件将要更新的生命周期
  componentWillUpdate() {
    console.log("Lifecycle 6. componentWillUpdate");
  }
  // 组件更新完毕
  componentDidUpdate() {
    console.log("Lifecycle 7. componentDidUpdate");
  }
}
export default Lifecycle;
