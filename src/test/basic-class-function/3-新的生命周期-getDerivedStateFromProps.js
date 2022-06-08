import React from "../react";
import ReactDOM from "../react/react-dom";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    };
  }
  handleClick = (e) => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };
  render() {
    return (
      <div id="app">
        <div>
          <h2>Counter: {this.state.counter}</h2>
          <Children counter={this.state.counter} />
          <button onClick={this.handleClick}>+1</button>
        </div>
      </div>
    );
  }
}

class Children extends React.Component {
  state = {
    counter: 0,
  };
  /**
   * 将props映射为自己新的state的 生命周期 是在类组件上的 是静态方法
   * getDerivedStateFromProps 会在调用 render 方法之前调用，
   * 并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，
   * 如果返回 null 则不更新任何内容。(此时state不会发生改变)
   * @param {*} nextProps
   * @param {*} prevState
   * TODO 在新版的react中  所有的带will的生命周期都弃用了 不建议使用
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const { counter } = nextProps;
    if (counter % 2 === 0)
      return {
        counter: counter * 2,
      };
    if (counter % 3 === 0)
      return {
        counter: counter * 3,
      };
    // return undefined;
    return null;
  }
  render() {
    console.log(this.state)
    return (
      <div>
        <h3>Children Counter: {this.state.counter}</h3>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
