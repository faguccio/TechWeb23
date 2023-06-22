import { linkList } from "../router";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import UserAvatar from "./UserAvatar";

function NavBar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  function handleClick() {
    setIsNavExpanded(!isNavExpanded);
  }

  return (
    <div>
      <div className="bg-primary flex flex-col justify-between px-2 md:py-2 sticky z-10 top-0">
        <div className="flex justify-between items-center">
          <div className="-ml-2 md:ml-0">
            <Link to="/">
              <img
                className="scale-50 md:scale-75"
                src="https://seeklogo.com/images/V/vulture-logo-AF847BCA43-seeklogo.com.png"
                width="75px"
                alt="website logo"
                onClick={() => window.scrollTo(0, 0)}
              />
            </Link>
          </div>

          <div className="hidden md:flex md:flex-row md:mx-5">{linkList}</div>

          <div className="flex items-center mr-4">
            <UserAvatar />
            <button
              className="btn btn-square btn-ghost scale-125 ml-4 md:hidden"
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 scale-125 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className={isNavExpanded ? "flex flex-col md:hidden" : "hidden"}>
          {linkList}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default NavBar;
