import { useEffect, useState } from "react";
import { Route, useNavigate, Link } from "react-router-dom";

function ChannelBar(setUrl) {
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
    <div className="bg-orange-400">
      <div className="flex flex-col align-center">
        <h2 className="">Channel List</h2>
        {channel.map((name) => {
          return (
            <Link
              to={`/channels/${name.replace("#", "")}`}
              className="btn btn-primary normal-case m-2"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              key={crypto.randomUUID()}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ChannelBar;
