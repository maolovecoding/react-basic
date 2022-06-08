import React from "../react";
import ReactDOM from "../react/react-dom";

class Button extends React.Component {
  state = {
    name: "按钮",
  };
  componentWillMount() {
    console.log("button componentWillMount ");
  }
  componentDidMount() {
    console.log("button componentDidMount ");
  }

  render() {
    console.log("button render");
    return (
      <button name={this.state.name} title={this.props.title}>
        按钮
      </button>
    );
  }
}

// 组件增强
const enhancer = (OldComponent) =>
  class extends OldComponent {
    state = {
      number: 0,
    };
    componentWillMount() {
      console.log("enhancer button componentWillMount ");
      super.componentWillMount();
    }
    componentDidMount() {
      console.log("enhancer button componentDidMount ");
      super.componentDidMount();
    }
    handleClick = () => {
      this.setState({
        number: this.state.number + 1,
      });
    };
    render() {
      console.log("enhancer button render");
      const renderElement = super.render();
      const newProps = {
        ...renderElement,
        ...this.state,
        onClick: this.handleClick,
      };
      // 克隆元素 给其新的 props 第三个参数开始 都是其子元素
      return React.cloneElement(renderElement, newProps);
    }
  };
const EnhancerButton = enhancer(Button);
class App extends React.Component {
  render() {
    return (
      <div>
        <h3>App</h3>
        <EnhancerButton title={"我是标题"} />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.querySelector("#root"));
