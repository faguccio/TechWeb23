import { useState } from "react";
import { Routes, Route } from "react-router-dom";


import { routeList } from "./router";
import NavBar from "./components/NavBar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <NavBar />
      <Routes>{routeList}</Routes>
    </div>
  );
}

export default App;

