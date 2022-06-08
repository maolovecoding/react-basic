import React from "../react";
import ReactDOM from "../react/react-dom";


const withLoading = (message) => (OldComponent) => {
  return class extends React.Component {
    state = {
      show() {
        const div = document.createElement("div");
        div.innerHTML = `
          <p id="loading" style="position:absolute; top:100px; z-index:1; background:#bfa;">${message}</p>
        `;
        document.body.appendChild(div);
      },
      hidden() {
        document.getElementById("loading").remove();
      },
    };
    render() {
      // 给老组件添加了一些额外的属性 state
      return <OldComponent {...this.props} {...this.state} />;
    }
  };
};

// 写法二：装饰器写法
// @withLoading("loading ......")
class App extends React.Component {
  render() {
    return (
      <div>
        <h3>App</h3>
        <button onClick={this.props.show}>show</button>
        <button onClick={this.props.hidden}>hidden</button>
      </div>
    );
  }
}
// 写法一：函数调用先传参 然后返回的函数再传入我们需要进行属性代理的组件
// const WithLoadingApp = withLoading("loading......")(App);
// ReactDOM.render(<WithLoadingApp />, document.querySelector("#root"));
ReactDOM.render(<App />, document.querySelector("#root"));
