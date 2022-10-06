// import CountButton from "./CountButton";
// import { useState } from "react";

let count = 0;
export default function Home() {
  // const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Home</h1>
      {/* <CountButton /> */}
      <button onClick={() => alert("hello world")}>{count}</button>
    </div>
  );
}

// tsx(jsx) -> js -> client
// tsx(jsx) -> js -> html -> client
