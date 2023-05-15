import { useForm } from 'react-hook-form';
import * as Login from './LoginPage';


function RegisterPage(){
    const { register, handleSubmit } = useForm();
    const onSubmit = data => {
        //console.log(data);
        registerUser(data.username, data.password, data.propic).then((res) => {
            //console.log("res", res);
            if(res.status === "success"){
                Login.loginUser(data);
            }
            
        });
        
    }

    const registerUser = async (username, password, propic) => {
        const res = await fetch(
            `http://localhost:3000/users/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: username,
                    password: password,
                    propic_path: propic
                }),
            }
        );
        const ret = await res.json();

        return ret;
    }


    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center w-96">
                <h1 className="text-4xl font-bold mb-8">Register</h1>
                <div className="alert alert-error shadow-lg hidden flex-row justify-start w-full mb-4"
                    role="alert" 
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span id='error_message' style={{margin:0}}></span>
                </div>
                <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
                    <input className="w-full mb-4 p-2 rounded-md" type="text" placeholder="Username" {...register("username", {required:true})}/>
                    <input className="w-full mb-4 p-2 rounded-md" type="password" placeholder="Password" {...register("password", {required:true})}/>
                    <input className="w-full mb-4 p-2 rounded-md" type="url" placeholder="Profile Pic" {...register("propic")}/>
                    <button className="w-full mb-4 p-2 rounded-md bg-blue-500 text-white font-bold" type="submit">Register</button>
                    <p className="text-sm">Already have an account? <a className="text-blue-500" href="/login">Login</a></p>
                </form>
            </div>
        </div>              
    )
}

export default RegisterPage;