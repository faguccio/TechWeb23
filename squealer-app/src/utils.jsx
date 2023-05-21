import {pages} from "./router.jsx";

const Const = {
    STATUS_OK: 200,
    STATUS_UNAUTHORIZED: 401,
}

const loginRequest = async (username, password) => {
    const res = await fetch(
      `http://localhost:3000/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
             name: username, 
             password: password 
        }),
      }
    );
    const ret = {
        data: await res.json(),
        status: await res.status
    }
   
    return ret;
};

export function loginUser (inputData) {
    loginRequest(inputData.username, inputData.password).then((res) => {
        
        if(res.status === Const.STATUS_OK){
            //document.querySelector(".alert").classList.replace("flex", "hidden")
            //remove old token and userID from Local Storage and add new ones
            localStorage.removeItem("token");
            localStorage.removeItem("userID");
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userID", res.data.userID);
            //redirect to home page
            window.location.href = pages[0].path; //pages[0] = home page
        }else if(res.status === Const.STATUS_UNAUTHORIZED){
            document.querySelector(".alert").classList.replace("hidden", "flex")
            document.querySelector("#error_message").innerHTML = res.data.message; 
        }
    });
}