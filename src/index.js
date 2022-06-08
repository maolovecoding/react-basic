// import React from "./react";
// import ReactDOM from "./react/react-dom";
// // import React from "react";
// // import ReactDOM from "react-dom";
// import Sum from "./test/lifecycle";

// // const element = React.createElement(
// //   "div",
// //   {
// //     style: {
// //       color: "red",
// //     },
// //   },
// //   "你好！"
// // );
// // const element = <div style={{ color: "red" }}>你好！</div>;
// // console.log(element);

// // 函数式组件
// // function FunctionComponent(props) {
// //   return (
// //     <div style={{ color: "red" }}>
// //       <span>{props.name}</span>
// //       <span>{props.children}</span>
// //     </div>
// //   );
// // }
// // const element = <FunctionComponent name="fc">你好！</FunctionComponent>;
// // console.log(element);

// // 类组件
// class ClassComponent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       counter: 0,
//       number: 10,
//     };
//   }
//   handleClick = (e) => {
//     // 阻止冒泡
//     // e.stopPropagation();

//     // 批量更新 是异步的 会在方法执行结束后更新
//     this.setState((state) => ({ counter: state.counter + 1 }));
//     console.log(this.state);
//     this.setState((state) => ({ counter: state.counter + 1 }));
//     console.log(this.state);
//     // setTimeout(() => {
//     //   // 在setTimeout里面是同步更新的
//     //   this.setState({ counter: this.state.counter + 1 });
//     //   console.log(this.state);
//     //   this.setState({ counter: this.state.counter + 1 });
//     //   console.log(this.state);
//     // });
//   };
//   handleDivClick = (event) => {
//     console.log(event);
//   };
//   render() {
//     return (
//       <div onClick={this.handleDivClick} style={{ color: "red" }}>
//         <div className="a">
//           <h3>计数器：{this.state.counter}</h3>
//           <button onClick={this.handleClick}>+1</button>
//         </div>
//       </div>
//     );
//   }
// }
// ReactDOM.render(<Sum />, document.getElementById("root"));

import "./test/hooks/3-useReducer";
