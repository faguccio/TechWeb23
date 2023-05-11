import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { routeList } from "./router";
import NavBar from "./components/NavBar";

const queryClient = new QueryClient({});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavBar />
        <Routes>{routeList}</Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
