import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/channels/@me");
  });
  return <div className="">Home page is pretty null if you ask me</div>;
}

export default HomePage;
