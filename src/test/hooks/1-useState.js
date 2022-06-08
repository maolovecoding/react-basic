import React, { useState } from "../../react";
import ReactDOM from "../../react/react-dom";

function App() {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  return (
    <div>
      <h3>App: {counter1}</h3>
      <h3>App: {counter2}</h3>
      <button
        onClick={() => {
          setCounter1(counter1 + 1);
          setCounter2(counter2 + 2);
        }}
      >
        按钮+1
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
