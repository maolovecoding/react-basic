import React from "../react";
import ReactDOM from "../react/react-dom";

class MouseTrackerBak extends React.Component {
  state = {
    x: 0,
    y: 0,
  };
  handleMouseMove = (e) => {
    console.log(e.clientX, e.clientY);
    this.setState({
      x: e.clientX,
      y: e.clientY,
    });
  };
  render() {
    return (
      <div
        style={{ background: "#bfa", width: "400px", height: "400px" }}
        onMouseMove={this.handleMouseMove}
      >
        <h3>App</h3>
        <h3>
          鼠标位置：x: {this.state.x} y: {this.state.y}
        </h3>
      </div>
    );
  }
}
/**
 * 这种写法 MouseTracker 类似于公共组件 需要渲染的内容由子组件决定
 * 自己不处理渲染逻辑
 */
class MouseTracker extends React.Component {
  state = {
    x: 0,
    y: 0,
  };
  handleMouseMove = (e) => {
    console.log(e.clientX, e.clientY);
    this.setState({
      x: e.clientX,
      y: e.clientY,
    });
  };
  render() {
    return (
      <div
        style={{ background: "#bfa", width: "400px", height: "400px" }}
        onMouseMove={this.handleMouseMove}
      >
        {/* {this.props.children(this.state)} */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

// ReactDOM.render(
//   <MouseTracker>
//     {(props) => (
//       <div>
//         <h3>App</h3>
//         <h3>
//           鼠标位置：x: {props.x} y: {props.y}
//         </h3>
//       </div>
//     )}
//   </MouseTracker>,
//   document.querySelector("#root")
// );
ReactDOM.render(
  <MouseTracker
    // 也可以作为render属性
    render={(props) => (
      <div>
        <h3>App</h3>
        <h3>
          鼠标位置：x: {props.x} y: {props.y}
        </h3>
      </div>
    )}
  />,
  document.querySelector("#root")
);
