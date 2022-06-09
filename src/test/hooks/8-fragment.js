import React from "../../react";
import ReactDOM from "../../react/react-dom";

function Parent() {
  return (
    <>
      <h3>你好</h3>
      <h3>你12</h3>
    </>
  );
}

ReactDOM.render(<Parent />, document.querySelector("#root"));
