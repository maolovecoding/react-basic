import React, { PureComponent } from "../react";
import ReactDOM from "../react/react-dom";

// 继承纯组件 props没改变 不需要重新渲染
class ClassCounter extends PureComponent {
  render() {
    console.log("ClassCounter render");
    return <h4>ClassCounter: {this.props.counter}</h4>;
  }
}
// props没有改变 不需要重新渲染
const FunctionCounter = React.memo(function FunctionCounter(props) {
  console.log("FunctionCounter render");
  return <h4>FunctionCounter: {props.counter}</h4>;
});

class App extends React.Component {
  state = {
    number: 0,
  };
  amountRef = React.createRef();
  handleClick = (e) => {
    const number = this.state.number + parseInt(this.amountRef.current.value);
    this.setState({ number });
  };
  render() {
    return (
      <div>
        <h3>App: {this.state.number}</h3>
        <ClassCounter counter={this.state.number} />
        <FunctionCounter counter={this.state.number} />
        <input ref={this.amountRef} />
        <button onClick={this.handleClick}>按钮 +1 </button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
