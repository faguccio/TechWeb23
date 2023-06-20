import { createContext, useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { pages } from "./router";
import NavBar from "./components/NavBar";

const queryClient = new QueryClient({});

function App() {
  //console.log("ciaoooo");

  localStorage.setItem(
    "sessionUUID",
    String(crypto.getRandomValues(new Uint32Array(10)))
  );
  const router = createBrowserRouter(
    [
      {
        element: <NavBar />,
        children: pages.map((page) => {
          return { path: page.path, element: page.element };
        }),
      },
    ],
    { basename: "/app" }
  );

  const loggedIn = useRef(!!localStorage.token);
  const loggedInContext = createContext(loggedIn.current);

  return (
    <loggedInContext.Provider value={loggedIn.current}> 
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </loggedInContext.Provider>
  );
}

export default App;
