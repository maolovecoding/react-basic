// import React from "react";
import React from "../react";

// class Sum extends React.Component {
//   constructor(props) {
//     super(props);
//     this.a = React.createRef();
//     this.b = React.createRef();
//     this.result = React.createRef();
//   }
//   handleClick = (e) => {
//     const a = this.a.current.value;
//     const b = this.b.current.value;
//     this.result.current.value = parseInt(a) + parseInt(b);
//   };
//   render() {
//     return (
//       <div>
//         <input ref={this.a} /> + <input ref={this.b} />{" "}
//         <button onClick={this.handleClick}>=</button>
//         <input ref={this.result} />
//       </div>
//     );
//   }
// }
const TextInput = React.forwardRef(TextInputFn);
console.log(TextInput)
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.testInputRef = React.createRef();
  }
  handleClick = (e) => {
    // this.testInputRef.current.getFocus();// 类组件ref current是组件实例
    this.testInputRef.current.focus(); // 函数式组件的ref current 就是真实dom
  };
  render() {
    return (
      <div className="ddd">
        <TextInput name="zs" ref={this.testInputRef} />
        <button onClick={this.handleClick}>获取焦点</button>
      </div>
    );
  }
}
// class TextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.input = React.createRef();
//   }
//   getFocus = (e) => {
//     this.input.current.focus()
//   };
//   render() {
//     return <input ref={this.input} />;
//   }
// }

function TextInputFn(props, forwardRef) {
  return <input ref={forwardRef} />;
}

export default Form;
