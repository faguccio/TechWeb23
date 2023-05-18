import { useQuery } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useForm} from 'react-hook-form';


function AccountPage() {

  if (!localStorage.getItem("token") && !localStorage.getItem("userID")) {
    window.location.replace("/login");
    return;
  }

  const userID = localStorage.getItem("userID").toString();

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:3000/user/${userID}`);
    
    return await res.json();
  };

  const { data: user, status } = useQuery(["user", userID], fetchUser);

  const { register, handleSubmit, reset } = useForm();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    window.location.replace("/");
  }
  
  const handleChangePassword = data => {
    changePassword(data);
  }
  async function changePassword(inputData){
    if(inputData.oldPassword === user.password){
      document.getElementById("modal-change-password").checked = false;

      const res = await fetch(`http://localhost:3000/user/${userID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: inputData.newPassword
        }),
      });
      const ret = await res.json();
      handleCloseModal();
      temporaryToast();

      return ret;
    }else{
      document.querySelector(".alert").classList.replace("hidden", "flex");
      document.querySelector("#error_message").innerHTML = "Old password is not correct!";
    }
  }
  const temporaryToast = async () => {
    document.getElementById("toast-change-password").classList.remove("hidden");
    await setTimeout(() => {document.getElementById("toast-change-password").classList.add("hidden");}, 5000);
  }
    
  const handleCloseModal = () => {
    document.querySelector(".alert").classList.replace("flex", "hidden");
    reset();
  }

  const handleChangeProfilePicture = () => {}
  const handleDeleteAccount = () => {
    document.getElementById("modal-delete-account").checked = false;
    deleteAccount();
  }
  async function deleteAccount(){
    const res = await fetch(`http://localhost:3000/user/${userID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ret = await res.json();
    handleLogout();
    return ret;
  }
  
  if (status === "error") {
    return <h1>Error</h1>;
  }
  if (status === "loading") {
    return(
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className="flex flex-col justify-center content-center items-center w-full">
        <div className="flex card shadow-xl compact bg-base-100 w-96 mb-12 bg-teal-50">
          <div className="mt-4 ml-4">
            {user.type == "normal" ? 
              (<div className="badge ml-2">Normal</div>) : null}
            {user.type == "pro" ?
              (<div className="badge badge-primary ml-2">Pro</div>) : null}
            {user.type == "admin" ?
              (<div className="badge badge-secondary ml-2">Moderator</div>) : null}
          </div>
          <div className="avatar px-10 py-4">
            <div className="w-96 mask mask-squircle">
              <img src={user.propic_path} alt="Profile Picture" />
            </div>
          </div>
          <div className="flex items-center card-body">
            <h2 className="card-title text-2xl mb-4">{user.name}</h2>
            
            <button 
              className="btn btn-outline"
              onClick={handleLogout}
            >Log out
            </button>
            
          </div>
        </div>
        <div className="flex justify-around w-96">
          <div>
          <label 
            htmlFor="modal-change-password"
            className=" btn btn-accent"
          >Change password
          </label>
          </div>
          
          <div>
          <label
            htmlFor="modal-delete-account"
            className=" btn btn-outline btn-error"
          >Delete account
          </label>
          </div>
        </div>
        {/*Modal for password change*/}
        <input type="checkbox" id="modal-change-password" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle cursor-pointer">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Change your password</h3>
            <form className="flex flex-col px-4" onSubmit={handleSubmit(handleChangePassword)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Old password</span>
                </label>
                <input type="password" placeholder="Old password" className="input input-bordered w-full mb-4 p-2 rounded-md" {...register("oldPassword", {required:true})}/>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New password</span>
                </label>
                <input type="password" placeholder="New password" className="input input-bordered w-full mb-4 p-2 rounded-md" {...register("newPassword", {required:true})}/>
              </div>
              <div className="form-control ">
                <div className="alert alert-error shadow-lg hidden flex-row justify-start w-full" role="alert">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span id='error_message' style={{margin:0}}></span>
                </div>

              </div>
              <div className="modal-action">
                <label htmlFor="modal-change-password" className="btn btn-outline" onClick={handleCloseModal}>Close</label>
                <label htmlFor="modal-change-password " >
                  <button className="btn btn-accent modal-open" type="submit">Change</button>          
                </label>
              </div>
            </form>
          </div>
        </div>
        {/* Toast alert for succesful password change */}
        <div id="toast-change-password" className="toast toast-start hidden">
          <div className="alert alert-info">
            <div>
              <span>Successful password change</span>
            </div>
          </div>
        </div>
        {/* Modal for account delete */}
        <input type="checkbox" id="modal-delete-account" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle cursor-pointer">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure you want to delete your account?</h3>
            <div className="modal-action px-4">
              <label htmlFor="modal-delete-account" className="btn btn-outline">Close</label>
              <label htmlFor="modal-delete-account" >
                <button className="btn btn-error modal-open" onClick={handleDeleteAccount}>Delete</button>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }


}

export default AccountPage;
