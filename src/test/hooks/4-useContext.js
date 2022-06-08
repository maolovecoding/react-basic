import React, { useReducer, useContext } from "../../react";
import ReactDOM from "../../react/react-dom";

// import React, { useReducer, useContext } from "react";
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
const CounterContext = React.createContext();

function Counter() {
  // useContext 参数就是Context对象
  const { state, dispatch } = useContext(CounterContext);
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
    </div>
  );
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, { counter: 0 });
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Counter />
    </CounterContext.Provider>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
