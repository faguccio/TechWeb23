import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { routeList } from "./router";
import NavBar from "./components/NavBar";
import PostCard from "./components/PostCard";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>{routeList}</Routes>
    </div>
  );
}

export default App;
