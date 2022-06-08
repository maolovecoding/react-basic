import React, { useState, useEffect, useReducer } from "../../react";
import ReactDOM from "../../react/react-dom";

// import React, { useState, useEffect,useReducer } from "react";
// import ReactDOM from "react-dom";

function reducer(state, action) {
  return state + 2;
}
function Counter(props) {
  const [counter, setCounter] = useState(0);
  // const [counter, dispatch] = useReducer(reducer,0);
  // 此函数是在组件和DOM渲染之后执行 用来执行副作用的代码
  useEffect(() => {
    console.log("开启定时器");
    const timer = setInterval(() => {
      // dispatch((counter) => counter + 1);
      setCounter((counter) => counter + 1);
    }, 1000);
    // 返回的清理函数 会在下次执行useEffect回调函数之前执行
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div>
      <h3>App: {counter}</h3>
    </div>
  );
}

const App = () => {
  return <Counter />;
};


ReactDOM.render(<App />, document.querySelector("#root"));
