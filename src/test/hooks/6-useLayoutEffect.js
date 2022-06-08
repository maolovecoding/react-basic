import React, { useRef, useLayoutEffect ,useEffect} from "../../react";
import ReactDOM from "../../react/react-dom";

// import React, { useRef, useLayoutEffect } from "react";
// import ReactDOM from "react-dom";

function Animation(props) {
  const ref = useRef();
  const style = {
    width: "100px",
    height: "100px",
    borderRadius: "500%",
    backgroundColor: "red",
  };
  // 会产生动画
  useEffect(() => {
    ref.current.style.transform = "translate(500px)";
    ref.current.style.transition = "all 3s";
  });

  // 在DOM绘制前执行副作用函数 直接就出现在最后的位置了 无动画
  // useLayoutEffect(() => {
  //   ref.current.style.transform = "translate(500px)";
  //   ref.current.style.transition = "all 3s";
  // });
  return <div style={style} ref={ref}></div>;
}

function App() {
  return <Animation />;
}

ReactDOM.render(<App />, document.querySelector("#root"));
