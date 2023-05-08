import Home from "./views/Home";

import { Route, Link } from "react-router-dom";


export const pages = [
    {
      path: "/",
      name: "home",
      element: <Home />,
      displayNav: true,
      id: 0,
    },

    ];

export const routeList = pages.map((page) => (
      <Route path={page.path} key={page.id} element={page.element} />
    ));

export const linkList = pages
    .filter((page) => page.displayNav)
    .map((page) => (
      <Link
        to={page.path}
        className="btn btn-ghost normal-case text-xl"
        onClick={() => window.scrollTo(0, 0)}
        key={page.id}
      >
        {page.name}
      </Link>
    ));