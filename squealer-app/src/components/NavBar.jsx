import { linkList } from "../router";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function NavBar() {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
  
    function handleClick() {
      setIsNavExpanded(!isNavExpanded);
    }
  
    return (
      <div className="md:flex md:justify-between sticky z-10 top-0 bg-base-100 items-center">
        <div className="flex justify-between items-center">
          <div className="-ml-10 md:ml-0">
            <NavLink to="/">
              <img
                className="py-2 scale-50 md:scale-75"
                src={img1}
                width="300px"
                alt="frisbee icon"
                onClick={() => window.scrollTo(0, 0)}
              />
            </NavLink>
          </div>
  
          <button
            className="btn btn-square btn-ghost scale-125 mx-8 md:hidden"
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
  
        <div
          className={
            isNavExpanded ? "grid md:flex md:mx-5" : "hidden md:flex md:mx-5"
          }
        >
          {linkList}
        </div>
      </div>
    );
  }
  
  export default NavBar;
  