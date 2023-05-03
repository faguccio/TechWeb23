import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import PostCard from "./components/PostCard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <PostCard user={fakeUser} content={fakeContent} />
    </>
  );
}

export default App;
