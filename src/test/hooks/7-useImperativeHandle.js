import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "../../react";
import ReactDOM from "../../react/react-dom";

// import React, {
//   useState,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import ReactDOM from "react-dom";

function Child(props, forwardRef) {
  const ref = useRef();
  // 返回给父组件的ref对象 是被我们包裹了一层的 这样父组件不能所以操作子组件
  useImperativeHandle(forwardRef, () => ({
    focus() {
      ref.current.focus();
    },
  }));
  return <input ref={ref} />;
}
const ForwardRefChild = forwardRef(Child);

function Parent() {
  const [number, setNumber] = useState(0);
  const ref = useRef();
  const getFocus = () => {
    ref.current.focus();
  };
  return (
    <div>
      <h3>number:{number}</h3>
      <button onClick={() => setNumber(number + 1)}>+1</button>
      <ForwardRefChild ref={ref} />
      <button onClick={getFocus}>获取焦点</button>
    </div>
  );
}

ReactDOM.render(<Parent />, document.querySelector("#root"));
