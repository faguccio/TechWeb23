import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { Const } from "../utils";
import { Link } from "react-router-dom";
//import { loggedInContext } from "../App";


function UserAvatar() {
    //const loggedIn = useContext(loggedInContext);
   // console.log("loggedIn:", loggedIn);

    const [avatarPath, setAvatarPath] = useState(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    );
    const [leftoverChars, setLeftoverChars] = useState(null);
    
    if (!!localStorage.token) {
        
        const fetchUser = async () => {
            const res = await fetch(`${Const.apiurl}/user`, {
                headers: { Authorization: localStorage.token },
            });
            return await res.json();
        };
    
        const { data: user } = useQuery(["user"], fetchUser);
    
        useEffect(() => {
          if (user) {
            if (user.propic_path !== "") {
              setAvatarPath(user.propic_path);
            }
            setLeftoverChars(user.leftovers_chars);
            //console.log("User Leftover Chars:", user.leftovers_chars);
          }
        }, [user]);
    }


    return (
        <div className="flex items-center">
            {!!localStorage.token ? (
            <Link to="/account">
                <div className="avatar">
                    <div className="w-12 rounded-full ring ring-offset-base-100 ring-offset-0">
                        <img src={avatarPath} />
                    </div>
                </div>
                <div className="ml-2 font-bold">
                    D: {leftoverChars?.day || 0} W: {leftoverChars?.week || 0} M:{" "}
                    {leftoverChars?.month || 0}
                </div>
            </Link>
            ) : (
            <Link to="/login">
                <button className="btn btn-sm btn-outline">Sign in</button>
            </Link>
            )}
        </div>
    );

}

export default UserAvatar;