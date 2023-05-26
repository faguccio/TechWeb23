import { linkList } from "../router";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";

function NavBar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [avatarPath, setAvatarPath] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");

  function handleClick() {
    setIsNavExpanded(!isNavExpanded);
  }


  if(localStorage.getItem("userID") !== null){

    const userID = localStorage.getItem("userID").toString();

    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/user/${userID}`);
      
      return await res.json();
    };

    const { data: user } = useQuery(["user", userID], fetchUser);
    
    useEffect(() => {
      if (user) {
        if (user.propic_path !== "") {
          setAvatarPath(user.propic_path);
        }
      }
    }, [user]);
  }


  return (
    <div className="md:flex md:justify-between sticky z-10 top-0 bg-base-100 items-center">
      <div className="flex justify-between items-center">
        <div className="-ml-2 md:ml-0">
          <NavLink to="/">
            <img
              className="py-2 scale-50 md:scale-75"
              src="https://seeklogo.com/images/V/vulture-logo-AF847BCA43-seeklogo.com.png"
              width="100px"
              alt="website logo"
              onClick={() => window.scrollTo(0, 0)}
            />
          </NavLink>
        </div>
        
        <div className="flex items-center">
          <div className="md:hidden">
            {localStorage.getItem("userID") !== null 
              ? (
                <NavLink to="/account">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-offset-base-100 ring-offset-0">
                      <img src={avatarPath} />
                    </div>
                  </div>
                </NavLink>
              ) : (
                <NavLink to="/login">
                  <button className="btn btn-sm btn-outline">Log in</button>
                </NavLink>
              )
            }
          </div>

          <button
            className="btn btn-square btn-ghost scale-125 mr-8 ml-4 md:hidden"
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

      <div
        className={
          isNavExpanded ? "grid md:flex md:mx-5" : "hidden md:flex md:mx-5"
        }
      >
        {linkList}
      </div>
      <div className="mr-8 hidden md:flex items-center">
        {localStorage.getItem("userID") !== null 
          ? (
            <NavLink to="/account">
              <div className="avatar">
                <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-0">
                  <img src={avatarPath} />
                </div>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <button className="btn btn-outline">Log in</button>
            </NavLink>
          )
        }
      </div>
    </div>
  );
}

export default NavBar;
