import { useForm } from "react-hook-form";
import { loginUser, Const } from "../utils";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { loggedInContext } from "../App";

function RegisterPage() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useContext(loggedInContext);

  const { register, handleSubmit } = useForm();
  const registerUser = async (username, password, propic) => {
    let user = {
      name: username,
      password: password,
    };
    if (propic !== "") {
      user.propic_path = propic;
    }
    console.log(user);
    const res = await fetch(`${Const.apiurl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const ret = await res.json();

    return ret;
  };

  const onSubmit = (data) => {
    //console.log(data);
    registerUser(data.username, data.password, data.propic).then((res) => {
      //console.log("res", res);
      if (res.status === "success") {
        loginUser(data, navigate, setLoggedIn);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full" lang="en">
      <div className="flex flex-col items-center justify-center w-96 mt-24">
        <h1 className="text-4xl font-bold mb-8">Register</h1>
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label
            htmlFor="username"
            className="label-text w-full flex justify-start mb-2"
          >
            Username
          </label>
          <input
            id="username"
            className="input input-bordered w-full mb-4 p-2 rounded-md"
            type="text"
            placeholder="Username"
            {...register("username", { required: true })}
          />
          <label
            htmlFor="password"
            className="label-text w-full flex justify-start mb-2"
          >
            Password
          </label>
          <input
            id="password"
            className="input input-bordered w-full mb-4 p-2 rounded-md"
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          <label
            htmlFor="propic"
            className="label-text w-full flex justify-start mb-2"
          >
            Profile Pic path
          </label>
          <input
            id="propic"
            className="input input-bordered w-full mb-4 p-2 rounded-md"
            type="url"
            placeholder="Profile Pic path"
            {...register("propic")}
          />
          <button
            className="w-full mb-4 p-2 rounded-md bg-blue-800 text-white font-semibold"
            type="submit"
          >
            Sign up
          </button>
          <p className="text-sm">
            Already have an account?{" "}
            <Link className="text-blue-500" aria-label="go to login page" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
