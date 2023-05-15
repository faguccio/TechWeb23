import { useForm} from 'react-hook-form';
import {pages} from '../router';

const Const = {
    STATUS_OK: 200,
    STATUS_UNAUTHORIZED: 401,
}

function LoginPage(){
    const { register, handleSubmit } = useForm();
    const onSubmit = data => {
        //console.log(data);
        loginUser(data);
    }

    

    

    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center w-96">
                <h1 className="text-4xl font-bold mb-8">Login</h1>
                <div className="alert alert-error shadow-lg hidden flex-row justify-start w-full mb-4"
                    role="alert"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span id='error_message' style={{margin:0}}></span>
                </div>
                <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
                    <input className="w-full mb-4 p-2 rounded-md" type="text" placeholder="Username" {...register("username", {required:true})}/>
                    <input className="w-full mb-4 p-2 rounded-md" type="password" placeholder="Password" {...register("password", {required:true})}/>  
                    <button className="w-full mb-4 p-2 rounded-md bg-blue-800 text-white" type="submit">Login</button>
                    <p className="text-sm">Don't have an account? <a className="text-blue-500" href="/register">Register</a></p>
                </form>
            </div>
        </div>
    )
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

export function loginUser (data) {
    loginRequest(data.username, data.password).then((res) => {
        //console.log("res", res);
        if(res.status === Const.STATUS_OK){
            document.querySelector(".alert").classList.replace("flex", "hidden")
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

export default LoginPage;