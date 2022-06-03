import React from "./react";
import ReactDOM from "./react/react-dom";
const element = React.createElement(
  "div",
  {
    style: {
      color: "red",
    },
  },
  "你好！"
);
// const element = <div style={{ color: "red" }}>你好！</div>;
console.log(element);
ReactDOM.render(element, document.getElementById("root"));
