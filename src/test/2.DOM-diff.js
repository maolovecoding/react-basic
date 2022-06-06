import React from "../react";
import ReactDOM from "../react/react-dom";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: ["海贼王", "火影忍者", "名侦探柯南", "死神", "喜洋洋", "灰太狼"],
    };
  }
  handleClick = (e) => {
    this.setState({
      list: ["名侦探柯南", "海贼王", "死神", "喜洋洋", "火影忍者2"],
    });
  };
  render() {
    return (
      <div id="app">
        <ul>
          {this.state.list.map((val) => (
            <li key={val}>{val}</li>
          ))}
        </ul>
        <div>
          <button onClick={this.handleClick}>+1</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
