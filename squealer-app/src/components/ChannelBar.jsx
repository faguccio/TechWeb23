import { useEffect, useState } from "react";
import { Route, useNavigate, Link } from "react-router-dom";

function ChannelBar() {
  const [channel, setChannel] = useState([]);

  const getChannelList = async () => {
    const res = await fetch(`http://localhost:3000/user/channels/all`, {
      headers: { Authorization: localStorage.token },
    });
    const ret = await res.json();

    setChannel(ret);
  };

  useEffect(() => {
    getChannelList();
  }, []);

  //console.log(localStorage.token);

  return (
    <div className="flex flex-1 flex-col align-center">
      <h2 className="flex flex-row justify-center text-black font-semibold text-2xl">
        Channel List
      </h2>
      {channel.map((name) => {
        return (
          <Link
            to={`/channels/${name.replace("#", "")}`}
            className="btn btn-primary normal-case m-2 mx-5"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            key={crypto.randomUUID()}
          >
            {name}
          </Link>
        );
      })}{" "}
      <a className="btn my-5">sium</a>
      <a className="btn my-5">sium</a>
      <a className="btn my-5">sium</a>
      <a className="btn my-5">sium</a>
      <a className="btn my-5">sium</a>
      <a className="btn my-5">sium</a>
      <a className="btn my-5">sium</a>
      <a className="btn my-5">sium</a>
    </div>
  );
}

export default ChannelBar;
