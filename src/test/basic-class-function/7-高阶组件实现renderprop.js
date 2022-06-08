import React from "../react";
import ReactDOM from "../react/react-dom";

function withTracker(OldComponent) {
  return class MouseTracker extends React.Component {
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
          <OldComponent {...this.state} />
        </div>
      );
    }
  };
}

function Show(props) {
  return (
    <div>
      <h3>App</h3>
      <h3>
        鼠标位置：x: {props.x} y: {props.y}
      </h3>
    </div>
  );
}

const WithTracker = withTracker(Show);

ReactDOM.render(<WithTracker />, document.querySelector("#root"));
