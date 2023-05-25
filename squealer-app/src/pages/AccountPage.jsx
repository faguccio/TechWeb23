import { useQuery, useMutation, useQueryClient } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";

function AccountPage() {

  if (!localStorage.getItem("token") && !localStorage.getItem("userID")) {
    window.location.replace("/login");
    return;
  }

  const userID = localStorage.getItem("userID").toString();

  const fetchUser = async (user_id) => {
    const res = await fetch(`http://localhost:3000/user/${user_id}`);
    console.log(res);
    return await res.json();
  };

  const upgradeAccount = async (inputData) =>{

    const res = await fetch(`http://localhost:3000/user/${userID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: inputData.type,
        card_number: inputData.cardNumber,
      }),
    });
    const ret = await res.json();
    console.log(ret, "account upgraded");
    return ret;
  }

  const queryClient = useQueryClient();
  const { data: user, status } = useQuery(["user", userID], () => fetchUser(userID));
  const {mutate} = useMutation(upgradeAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries("user", userID);
    },
  });  

  const { register: registerPw, handleSubmit: handleSubmitPw, reset: resetPw, setFocus: setFocusPw } = useForm();
  const { register: registerUpgrade, handleSubmit: handleSubmitUpgrade, reset: resetUpgrade, setFocus: setFocusUpgrade } = useForm();
  const { register: registerManager, handleSubmit: handleSubmitManager, reset: resetManager, setFocus: setFocusManager } = useForm();

  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [modalUpgradeAccount, setModalUpgradeAccount] = useState(false);
  const [modalDeleteAccount, setModalDeleteAccount] = useState(false);
  const [modalManager, setModalManager] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    window.location.replace("/");
  }
  
  const handleChangePassword = data => {
    changePassword(data);
  }
  const changePassword = async (inputData) =>{
    if(inputData.oldPassword === user.password){
      setModalChangePassword(false);

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

      console.log(ret, "password changed");
      return ret;
    }else{
      document.querySelector(".alert").classList.replace("hidden", "flex");
      document.querySelector("#error_message").innerHTML = "Old password is not correct!";
    }
  }
  const temporaryToast = async () => {
    document.getElementById("toast-change-password").classList.remove("hidden");
    await setTimeout(() => {document.getElementById("toast-change-password").classList.add("hidden");}, 3000);
  }
    
  const handleCloseModal = () => {
    setModalChangePassword(false);
    document.querySelector(".alert").classList.replace("flex", "hidden");
    resetPw();
  }

  const handleChangeProfilePicture = () => {}

  const handleUpgradeAccount = data => {
    mutate(data)
    setModalUpgradeAccount(false);
    resetUpgrade();
  }

  const handleDeleteAccount = () => {
    setModalDeleteAccount(false);
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

  const handlechooseManager = data => {
    setModalManager(false);
    mutateManager(data);
    resetManager();
  }
  const chooseManager = async (inputData) =>{
    
    const managerId = inputData.managerId;
    const res = await fetch(`http://localhost:3000/user/${managerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        managing: userID
      }),
    });
    const ret = await res.json();
    console.log(ret, "manager set");
    return ret;
  }
  
  const fetchAvailableManagers = async () => {
    const res = await fetch(`http://localhost:3000/users/managers`);
    const ret =  await res.json();
    //console.log("return managers:",ret); 
    //setManagers(ret);
    return ret;
  }
  
  const fetchManager = async () => {
    const res = await fetch(`http://localhost:3000/user/manager/${userID}`);
    const ret =  await res.json();
    //console.log("manager:",ret);
    return ret;
  }

  const removeManager = async () =>{
    const managerId = manager._id;
    const res = await fetch(`http://localhost:3000/user/${managerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        managing: null
      }),
    });
    const ret = await res.json();
    console.log(ret, "manager removed");
    return ret;
  }

  const { data: manager, status: statusManager } = useQuery(["managerByUser", userID], fetchManager, {enabled: !!user && user.type === "vip"});
  const {mutate: mutateManager} = useMutation(chooseManager, {
    onSuccess: () => {
      queryClient.invalidateQueries("managerByUser", userID);
    },
  });
  const {mutate: mutateRemoveManager} = useMutation(removeManager, {
    onSuccess: () => {
      queryClient.invalidateQueries("managerByUser", userID);
    },
  });
  const { data: availableManagers, status: statusAvailableManagers } = useQuery("availableManagers", fetchAvailableManagers, {enabled: !!user && user.type === "vip"} );
  const userManaged = user?.managing;
  const { data: userVip, status: statusUserVip } = useQuery(["userManaged", userManaged], () => fetchUser(userManaged), {enabled: !!user && !!userManaged && user.type === "manager"});

  const handleRemoveManager = () => {
    mutateRemoveManager();
  }  

  const printVipView = () => {   
    if(statusManager === "loading"){
      //console.log("loading manager:",manager);
      return(
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      );
    }
    if(statusManager === "success"){
      //console.log("success manager:",manager);
      if(manager === null){
        return(
          <button
            htmlFor="modal-smm"
            className="btn btn-primary"
            onClick={() => setModalManager(true)}
          >Choose Manager
          </button>
        );
      }else{
        return(
          <div className="flex flex-col items-center">
            <p className="text-base">Manager</p>
            <p className="text-xl font-medium">{manager.name}</p>
            <button 
              className="btn btn-error  btn-xs mt-2" 
              aria-label="Remove choosed manager" 
              onClick={handleRemoveManager}>Remove</button>
          </div>
        );
      }
    }
  }

  const printManagerView = () => {
    if(userManaged === null){
      return(
        <div className="flex flex-col items-center justify-center">
          <p className="text-base">Managed account</p>
          <p className="text-base text-red-500">NONE</p>
        </div>
      );
    }

    if(statusUserVip === "loading"){
      return(
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      );
    }
    if(statusUserVip === "success"){
      if(userVip !== null){
        return(
          <div className="flex flex-col items-center">
            <p className="text-base">Managed account</p>
            <p className="text-xl font-medium">{userVip.name}</p>
          </div>
        );
      }
    }
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
      <div className="flex flex-col justify-center content-center items-center w-full" lang="en">
        <h1 className="text-4xl font-bold text-center hidden">Profile Page</h1>
        <div className="flex card shadow-lg compact bg-base-100 w-full mb-12 bg-teal-50">
          <div className="mt-4 ml-4">
            {user.type == "normal" ? 
              (<div className="badge ml-2">Normal</div>) : null}
            {user.type == "vip" ?
              (<div className="badge badge-primary ml-2">Vip</div>) : null}
            {user.type == "manager" ?
              (<div className="badge badge-primary ml-2">Manager</div>) : null}
            {user.type == "admin" ?
              (<div className="badge badge-secondary ml-2">Moderator</div>) : null}
          </div>
          <div className="avatar px-10 py-2">
            <div className="w-96 mask mask-squircle">
              <img src={user.propic_path} alt="Profile Picture" />
            </div>
          </div>
          <div className="flex items-center card-body">
            <h2 className="card-title text-2xl mb-4">{user.name}</h2>
            
            <div className="flex justify-around items-center w-full">
              {user.type == "normal" ?
                (
                  <button 
                    htmlFor="modal-upgrade-account" 
                    className="btn btn-primary" 
                    aria-label="upgrade accoutn to vip" 
                    onClick={()=>{setModalUpgradeAccount(true)}} >
                    Updrade
                  </button>
                ) : null}
              {user.type == "vip" ? 
                printVipView() : null}
              {user.type == "manager" ?
                printManagerView() : null}
                
              <button 
                className="btn btn-sm"
                onClick={handleLogout}
              >Log out
              </button>
            </div>
            
          </div>
        </div>
        <div className=" flex flex-col items-center content-end">
          <button 
            htmlFor="modal-change-password"
            className=" btn btn-info mb-6"
            onClick={() => {setModalChangePassword(true)}}
          >Change password
          </button>
          
          <button
            htmlFor="modal-delete-account"
            className=" btn btn-outline btn-error btn-sm"
            onClick={() => setModalDeleteAccount(true)}
          >Delete account
          </button>
        </div>
        {/*Modal for password change*/}
        <input type="checkbox" id="modal-change-password" className="modal-toggle" checked={modalChangePassword} onChange={()=>{setModalChangePassword(false)}} />
        <div className="modal modal-bottom sm:modal-middle cursor-pointer">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Change your password</h3>
            <form className="flex flex-col px-4" onSubmit={handleSubmitPw(handleChangePassword)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Old password</span>
                </label>
                <input type="password" placeholder="Old password" className="input input-bordered w-full mb-4 p-2 rounded-md"  {...registerPw("oldPassword", {required:true})}/>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New password</span>
                </label>
                <input type="password" placeholder="New password" className="input input-bordered w-full mb-4 p-2 rounded-md" {...registerPw("newPassword", {required:true})}/>
              </div>
              <div className="form-control ">
                <div className="alert alert-error shadow-lg hidden flex-row justify-start w-full" role="alert">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span id='error_message' style={{margin:0}}></span>
                </div>

              </div>
              <div className="modal-action">
                <button htmlFor="modal-change-password" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <label htmlFor="modal-change-password " >
                  <button className="btn btn-info modal-open" type="submit">Change</button>          
                </label>
              </div>
            </form>
          </div>
        </div>
        {/* Toast alert for succesful password change */}
        <div id="toast-change-password" className="toast toast-end toast-middle hidden">
          <div className="alert alert-info">
            <div>
              <span>Successful password change</span>
            </div>
          </div>
        </div>
        {/* Modal for account delete */}
        <input type="checkbox" id="modal-delete-account" className="modal-toggle" checked={modalDeleteAccount} onChange={()=>{setModalDeleteAccount(false)}}/>
        <label htmlFor="modal-delete-account" className="modal cursor-pointer">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure you want to delete your account?</h3>
            <div className="modal-action">
              <label htmlFor="modal-delete-account" >
                <button className="btn btn-error modal-open" onClick={handleDeleteAccount}>Delete</button>
              </label>
            </div>
          </div>
        </label>
        {/* Modal for upgrade account to Pro */}
        {user.type == "normal" && (
          <>
          <input type="checkbox" id="modal-upgrade-account" className="modal-toggle" checked={modalUpgradeAccount} onChange={()=>{setModalUpgradeAccount(false)}}/>
          <div className="modal">
            <div className="modal-box relative">
              <button htmlFor="modal-upgrade-account" className="btn btn-sm btn-circle absolute right-2 top-2" aria-label="close modal upgrade account" onClick={()=>{setModalUpgradeAccount(false)}}>✕</button>
              <h3 className="text-lg font-bold mb-6">Upgrade to Pro</h3>
              <form className="flex flex-col" onSubmit={handleSubmitUpgrade(handleUpgradeAccount)}>
                <div className="form-control mb-3">
                  <p className="text-lg"> Price: <span className=" text-red-500">5$/month</span></p> 
                </div>
                <div className="form-control">
                  <input type="number" placeholder="Card number" className="input input-bordered w-full mb-4 p-2 rounded-md" {...registerUpgrade("cardNumber", {required:true, valueAsNumber: true})}/>
                </div>
                <div className="form-control">
                  <div className="flex items-center mb-3">
                    <input type="radio" name="account-type" value="vip" className="radio radio-primary mr-3" checked {...registerUpgrade("type", {required:true})}/>
                    <label className="text">Vip</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" name="account-type" value="manager" className="radio radio-primary mr-3" {...registerUpgrade("type", {required:true})}/>
                    <label className="text">Manager</label>
                  </div>
                </div>
                <div className="modal-action">
                  <label htmlFor="modal-upgrade-account" >
                    <button className="btn btn-primary modal-open" type="submit">Upgrade</button>
                  </label>
                </div>
              </form>
                  
            </div>
          </div>
          </>
        )}
        {/* Modal for chosing Social Media Manager */}
        {user.type === "vip" && (
          <>
          <input type="checkbox" id="modal-smm" className="modal-toggle" checked={modalManager} onChange={()=>{setModalManager(false)}}/>
          <div className="modal">
            <div className="modal-box relative">
              <button htmlFor="modal-smm" className="btn btn-sm btn-circle absolute right-2 top-2" aria-label="close modal upgrade account" onClick={()=>{setModalManager(false)}}>✕</button>
              <h3 className="text-lg font-bold mb-6">Choose your Manager</h3>
              <form className="flex flex-col" onSubmit={handleSubmitManager(handlechooseManager)}>
                <div className="form-control mb-2">
                <select className="select select-bordered w-full max-w-xs" defaultValue="" {...registerManager("managerId", {required:true})}>
                  <option disabled value="">Social Media Manager</option>
                  {statusAvailableManagers==="success" ?  
                    (availableManagers.map((user) => (
                      <option key={user._id} value={user._id}>{user.name}</option>))):null}
                </select>
                </div>
                <div className="modal-action">
                  <label htmlFor="modal-smm" >
                    <button className="btn btn-primary modal-open" type="submit">Choose</button>
                  </label>
                </div>
              </form>
                  
            </div>
          </div>
          </>
        )}

      </div>
    );
  }


}

export default AccountPage;
