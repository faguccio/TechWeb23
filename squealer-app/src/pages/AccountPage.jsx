import { useQuery } from "react-query";

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

  const { data: user } = useQuery(["user", userID], fetchUser);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    window.location.replace("/login");
  }
  
  //console.log(user);

  return (
    <div className="flex justify-center">
      <button 
        className="btn btn-warning"
        onClick={handleLogout}
      >Log out</button>
    </div>
  );
}

export default AccountPage;
