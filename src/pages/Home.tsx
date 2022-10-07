import { useState } from "preact/hooks";

let count = 0;
export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}
