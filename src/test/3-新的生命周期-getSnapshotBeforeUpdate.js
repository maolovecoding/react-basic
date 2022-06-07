import React from "../react";
import ReactDOM from "../react/react-dom";

class ScrollList extends React.Component {
  state = {
    messages: [],
  };
  wrapper = React.createRef();
  addMessage = () => {
    this.setState({
      messages: [this.state.messages.length, ...this.state.messages],
    });
  };
  componentDidMount() {
    this.timer = setInterval(this.addMessage, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  /**
   * 获取更新前的快照 执行render以后，还没把更新同步到dom上之前调用
   * getSnapshotBeforeUpdate() 在最近一次渲染输出（提交到 DOM 节点）之前调用。
   * 它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。
   * 此生命周期方法的任何返回值将作为参数传递给 componentDidUpdate()。
   * @param {*} prevProps
   * @param {*} prevState
   */
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log(prevProps, prevState);
    return {
      // 更新前向上卷去的高度
      prevScrollTop: this.wrapper.current.scrollTop,
      // 内容的高度
      prevScrollHeight: this.wrapper.current.scrollHeight,
    };
  }
  componentDidUpdate(
    prevProps,
    prevState,
    { prevScrollTop, prevScrollHeight }
  ) {
    console.log(prevProps, prevState);
    this.wrapper.current.scrollTop =
      prevScrollTop + (this.wrapper.current.scrollHeight - prevScrollHeight);
    console.log("update");
  }
  render() {
    console.log("render");
    const style = {
      width: "200px",
      height: "200px",
      background: "#bfa",
      border: "1px solid #ccc",
      overflow: "auto",
    };
    return (
      <div style={style} ref={this.wrapper}>
        {this.state.messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    );
  }
}

ReactDOM.render(<ScrollList />, document.querySelector("#root"));
