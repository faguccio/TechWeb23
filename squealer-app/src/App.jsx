import { createContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { pages } from "./router";
import NavBar from "./components/NavBar";

const queryClient = new QueryClient({});
export const loggedInContext = createContext(null);

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

  const loggedState = useState(!!localStorage.token);

  return (
    <loggedInContext.Provider value={loggedState}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </loggedInContext.Provider>
  );
}

export default App;
