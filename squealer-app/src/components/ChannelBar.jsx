import { useEffect, useState } from "react";
import { Route, Link } from "react-router-dom";
import { Const } from "../utils";

function ChannelBar({ ccopy, setSub }) {
  const [channel, setChannel] = useState([]);

  if (!localStorage.token) {
    return (
      <div className="m-6 flex flex-col items-center">
        <p classame="text-xl text-black">
          if you were logged, here the channels would appear
        </p>
        <Link
          to={`/login`}
          className="btn btn-primary normal-case m-2 mx-5"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          Login
        </Link>
      </div>
    );
  }

  const getChannelList = async () => {
    const res = await fetch(`${Const.apiurl}/user/channels/all`, {
      headers: { Authorization: localStorage.token },
    });
    const ret = await res.json();

    setChannel(ret);
    if (ccopy) {
      ccopy.current = ret;
      setSub(true);
      console.log(setSub);
    }
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
            key={String(crypto.getRandomValues(new Uint32Array(10)))}
          >
            {name}
          </Link>
        );
      })}
    </div>
  );
}

export default ChannelBar;
