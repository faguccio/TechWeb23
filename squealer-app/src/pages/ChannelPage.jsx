import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ChannelBar from "../components/ChannelBar";
import PostRenderer from "../components/PostRenderer";
import SearchBar from "../components/SearchBar";
import { Const } from "../utils";

function ChannelPage() {
  const params = useParams();

  const [sideOpen, setSideOpen] = useState(false);
  const navigate = useNavigate();

  const [subbed, setSubbed] = useState(false);
  const channelCopy = useRef([]);

  const putHash = (str) => {
    return ["§", "@"].includes(str[0]) ? str : "#" + str;
  };

  useEffect(() => {
    setSubbed(channelCopy.current.includes(putHash(params.name)));
  }, [params, subbed]);

  const toggleSubscription = async () => {
    const channelName = putHash(params.name);
    if (channelCopy.current.includes(channelName)) {
      channelCopy.current = channelCopy.current.filter((chName) => {
        if (chName != channelName) return chName;
      });
    } else {
      channelCopy.current.push(channelName);
    }
    const res = await fetch(`${Const.apiurl}/user`, {
      method: "PATCH",
      headers: {
        Authorization: localStorage.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channels: channelCopy.current }),
    });
    console.log(res);
    console.log(channelCopy.current);
    setSubbed(!subbed);
  };

  return (
    <div className="">
      <div className="fixed z-10 bg-slate-300 w-full">
        <div className="flex justify-center m-2 gap-1">
          <SearchBar
            callback={(query) => {
              navigate(encodeURI(`/search/posts?kw=${query}`));
            }}
          />
          <button
            onClick={() => {
              setSideOpen(!sideOpen);
            }}
            className={`btn btn-md md:hidden`}
          >
            ch
          </button>
        </div>

        <div
          className={`${
            sideOpen ? "left-0" : "-left-72"
          } h-screen fixed flex w-72 md:left-0 md:w-72 bg-secondary duration-300`}
        >
          <div className={`overflow-y-scroll flex flex-1`}>
            <ChannelBar ccopy={channelCopy} setSub={setSubbed} />
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center items-stretch bg-slate-800 md:ml-72 pt-12"
        onClick={() => setSideOpen(false)}
      >
        <div className="w-full flex flex-wrap mb-12 mt-16 items-center justify-around">
          <h2 className="text-2xl font-semibold md:text-3xl bg-shadow-md">
            {putHash(params.name)}
          </h2>
          <button
            className="relative left-4 btn btn-sm "
            onClick={toggleSubscription}
          >
            {subbed ? "unsubscribe" : "subscribe"}
          </button>
        </div>

        <PostRenderer params={params} />
      </div>
    </div>
  );
}

export default ChannelPage;
