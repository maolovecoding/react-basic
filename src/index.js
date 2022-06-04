import React from "react";
import ReactDOM from "react-dom";
// const element = React.createElement(
//   "div",
//   {
//     style: {
//       color: "red",
//     },
//   },
//   "你好！"
// );
// const element = <div style={{ color: "red" }}>你好！</div>;
// console.log(element);

// 函数式组件
// function FunctionComponent(props) {
//   return (
//     <div style={{ color: "red" }}>
//       <span>{props.name}</span>
//       <span>{props.children}</span>
//     </div>
//   );
// }
// const element = <FunctionComponent name="fc">你好！</FunctionComponent>;
// console.log(element);

// 类组件
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      number:10
    };
  }
  handleClick = (e) => {
    this.setState({ counter: this.state.counter + 1 },()=>{
      console.log("更新状态")
    });
    console.log(this.state)
  };
  render() {
    return (
      <div style={{ color: "red" }}>
        <h3>计数器：{this.state.counter}</h3>
        <button onClick={this.handleClick}>+1</button>
      </div>
    );
  }
}
ReactDOM.render(<ClassComponent />, document.getElementById("root"));
