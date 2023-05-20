import { useForm } from 'react-hook-form';
import { loginUser } from '../utils';

function RegisterPage(){
    const { register, handleSubmit } = useForm();

    const registerUser = async (username, password, propic) => {
        let user = {
            name: username,
            password: password,
        }
        if(propic!==""){
            user.propic_path = propic;
        }
        console.log(user);
        const res = await fetch(
            `http://localhost:3000/users/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            }
        );
        const ret = await res.json();

        return ret;
    }

    const onSubmit = data => {
        //console.log(data);
        registerUser(data.username, data.password, data.propic).then((res) => {
            //console.log("res", res);
            if(res.status === "success"){
                loginUser(data);
            }
            
        });
        
    }



    return(
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center w-96 mt-24">
                <h1 className="text-4xl font-bold mb-8">Register</h1>
                <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
                    <input className="w-full mb-4 p-2 rounded-md" type="text" placeholder="Username" {...register("username", {required:true})}/>
                    <input className="w-full mb-4 p-2 rounded-md" type="password" placeholder="Password" {...register("password", {required:true})}/>
                    <input className="w-full mb-4 p-2 rounded-md" type="url" placeholder="Profile Pic" {...register("propic")}/>
                    <button className="w-full mb-4 p-2 rounded-md bg-blue-500 text-white font-bold" type="submit">Sign up</button>
                    <p className="text-sm">Already have an account? <a className="text-blue-500" href="/login">Sign in</a></p>
                </form>
            </div>
        </div>              
    )
}

export default RegisterPage;