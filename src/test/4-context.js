import React from "../react";
import ReactDOM from "../react/react-dom";

const ThemeContext = React.createContext();
const { Consumer, Provider } = ThemeContext;
console.log(ThemeContext);
class App extends React.Component {
  state = {
    color: "red",
  };
  handleChangeColor = (color) => {
    this.setState({
      color,
    });
  };
  render() {
    return (
      <div>
        <Provider
          value={{
            color: this.state.color,
            changeColor: this.handleChangeColor,
          }}
        >
          <div>
            <Head />
            <Main />
          </div>
        </Provider>
      </div>
    );
  }
}
class Main extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div>
        <h2 style={{ color: this.context.color }}>我是main组件</h2>
        <button onClick={() => this.context.changeColor("#bfa")}>
          bfa颜色
        </button>
      </div>
    );
  }
}

function Head(props) {
  return (
    <div>
      <Consumer>
        {(value) => (
          <div>
            <h2 style={{ color: value.color }}>你好！</h2>
            <button onClick={() => value.changeColor("#ccc")}>ccc颜色</button>
          </div>
        )}
      </Consumer>
    </div>
  );
}
ReactDOM.render(<App />, document.querySelector("#root"));
