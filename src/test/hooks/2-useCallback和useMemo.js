import React, { useState, useMemo, useCallback, memo } from "../../react";
import ReactDOM from "../../react/react-dom";

const Child = memo(function Child({ data, handleClick }) {
  console.log("Child render");
  return <button onClick={handleClick}>按钮 {data.counter}</button>;
});

function App() {
  const [counter, setCounter] = useState(0);
  // 可以发现 name的值发生改变的情况下 Child组件也会重新渲染 （其实没必要 但是data和函数 所以重新渲染了）
  const [name, setName] = useState("mao");
  // 我们希望data在App组件重新渲染的时候，如果number变了 就变成新的data 如果counter没有变化 就返回老data
  const data = useMemo(() => ({ counter }), [counter]);
  const handleClick = useCallback(() => setCounter(counter + 1), [counter]);
  return (
    <div>
      <h3>App: {counter}</h3>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Child data={data} handleClick={handleClick} />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
