import React, { useReducer,useState } from "../../react";
import ReactDOM from "../../react/react-dom";

// import React, { useReducer } from "react";
// import ReactDOM from "react-dom";
/**
 * 改变状态state的函数
 * @param {*} state  状态
 * @param {*} action 行为
 * @returns
 */
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { counter: state.counter + 1 };
    case "decrement":
      return { counter: state.counter - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  // reducer 是一个改变状态的函数 第二个参数是初始值 state
  const [state, dispatch] = useReducer(reducer, { counter: 0 });
  const [number, setNumber] = useState(10);
  // 可以发现 name的值发生改变的情况下 Child组件也会重新渲染 （其实没必要 但是data和函数 所以重新渲染了）
  // 我们希望data在App组件重新渲染的时候，如果number变了 就变成新的data 如果counter没有变化 就返回老data
  return (
    <div>
      <h3>App: {state.counter}</h3>
      <button
        onClick={() => {
          dispatch({ type: "increment" });
        }}
      >
        +1
      </button>
      <button
        onClick={() => {
          dispatch({ type: "decrement" });
        }}
      >
        -1
      </button>
      <h3>number: {number}</h3>
      <button onClick={() => setNumber(number + 10)}>+10</button>
    </div>
  );
}

ReactDOM.render(<Counter />, document.querySelector("#root"));
