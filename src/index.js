import React from "./react";
import ReactDOM from "./react/react-dom";
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
  render() {
    return (
      <div style={{ color: "red" }}>
        <span>{this.props.name}</span>
        <span>{this.props.children}</span>
      </div>
    );
  }
}
ReactDOM.render(<ClassComponent name="fc">你好！</ClassComponent>, document.getElementById("root"));
