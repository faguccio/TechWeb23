import { Route, Link, createBrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import ChannelPage from "./pages/ChannelPage";
import SearchPage from "./pages/SearchPage";
import NewPostPage from "./pages/NewPostPage";
import AutoFunction from "./pages/AutoFunction";
import CreateChannelPage from "./pages/CreateChannelPage";
import VisualizeMap from "./pages/VisualizeMap";

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
    path: "/newpost",
    name: "new post",
    element: <NewPostPage />,
    displayNav: true,
    id: 3,
    class: "btn btn-info",
  },
  {
    path: "/account",
    name: "account",
    element: <AccountPage />,
    displayNav: false,
    id: 4,
  },
  {
    path: "/channels/:name",
    default: "/channels/§JOKESQUEAL",
    name: "channel",
    element: <ChannelPage />,
    displayNav: true,
    id: 5,
  },
  {
    path: "/search/posts",
    name: "search",
    element: <SearchPage />,
    displayNav: false,
    id: 6,
  },
  {
    path: "/post/automatic",
    name: "automatic",
    element: <AutoFunction />,
    displayNav: true,
    id: 9,
  },
  {
    path: "/new/channels/",
    name: "channelCreation",
    element: <CreateChannelPage />,
    displayNav: true,
    id: 10,
  },
  {
    path: "/channels/:name/visualize",
    default: "/channels/info/visualize",
    name: "visualService",
    element: <VisualizeMap />,
    displayNav: true,
    id: 122,
  },
];

/*export const routeList = pages.map((page) => (
  <Route path={page.path} key={page.id} element={page.element} />
));*/

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
