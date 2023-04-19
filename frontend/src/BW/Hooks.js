import React, { useState } from "react";

const Hooks = (Props) => {
  const [count, setCount] = useState(0);
	
  return (
    <div>
      counter = {count}
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
};

export default Hooks;
