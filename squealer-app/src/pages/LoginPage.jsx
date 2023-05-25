import { useForm} from 'react-hook-form';
import { loginUser } from '../utils';


function LoginPage(){
    const { register, handleSubmit } = useForm();
    const onSubmit = inputData => {
        //console.log(data);
        loginUser(inputData);     
    }

    return(
        <div className="flex flex-col items-center justify-center h-full" lang='en'>
            <div className="flex flex-col items-center justify-center w-96 mt-24">
                <h1 className="text-4xl font-bold mb-8">Log in</h1>
                <div className="alert alert-error shadow-lg hidden flex-row justify-start w-4/5 mb-4"
                    role="alert"
                    aria-roledescription='alert'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span id='error_message' style={{margin:0}}></span>
                </div>  
                <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="username" className='label-text w-full flex justify-start mb-2'>Username</label>
                    <input id="usernanme" className="w-full mb-4 p-2 rounded-md input input-bordered" type="text" placeholder="Username" {...register("username", {required:true})}/>
                    <label htmlFor="password" className='label-text w-full flex justify-start mb-2'>Password</label>
                    <input id="password" className="w-full mb-4 p-2 rounded-md input input-bordered" type="password" placeholder="Password" {...register("password", {required:true})}/>  
                    <button className="w-full mb-4 p-2 rounded-md bg-blue-800 text-white" type="submit">Sign in</button>
                    <p className="text-sm">Don't have an account? <a className="text-blue-500" aria-label='go to register page' href="/register">Sign up</a></p>
                </form>
            </div>
        </div>
    )
}


export default LoginPage;