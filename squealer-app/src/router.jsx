import { Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import ChannelPage from "./pages/ChannelPage";


export const pages = [
  {
    path: "/",
    name: "home",
    element: <HomePage />,
    displayNav: false,
    id: 0,
  },
  {
    path: "/register",
    name: "register",
    element: <RegisterPage />,
    displayNav: false,
    id: 1,
  },
  {
    path: "/login",
    name: "login",
    element: <LoginPage />,
    displayNav: false,
    id: 2,
  },
  {
    path: "/account",
    name: "account",
    element: <AccountPage />,
    displayNav: false,
    id: 3,
  },
  {
    path: "/channels/:name",
    default: "/channels/§JOKESQUEAL",
    name: "channel",
    element: <ChannelPage />,
    displayNav: true,
    id: 2,
  },
];

export const routeList = pages.map((page) => (
  <Route path={page.path} key={page.id} element={page.element} />
));

export const linkList = pages
  .filter((page) => page.displayNav)
  .map((page) => (
    <Link
      to={page.default ? page.default : page.path}
      className="btn btn-ghost normal-case text-xl"
      onClick={() => window.scrollTo(0, 0)}
      key={page.id}
    >
      {page.name}
    </Link>
  ));
