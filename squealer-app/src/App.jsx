import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import PostCard from "./components/PostCard";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({});

function App() {
  const [count, setCount] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <PostCard id={"64565a05867620df0ef89f49"} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
