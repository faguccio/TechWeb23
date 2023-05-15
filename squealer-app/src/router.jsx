import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

import { Route, Link } from "react-router-dom";

export const pages = [
  {
    path: "/",
    name: "home",
    element: <HomePage />,
    displayNav: false,
    id: 0,
  },
  {
    path: "/account",
    name: "account",
    element: <AccountPage />,
    displayNav: true,
    id: 1,
  },
  {
    path: "/register",
    name: "register",
    element: <RegisterPage />,
    displayNav: false,
    id: 2,
  },
  {
    path: "/login",
    name: "login",
    element: <LoginPage />,
    displayNav: false,
    id: 3,
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
