import { useEffect, useState } from "react";
import ReactionBar from "./ReactionBar";
import { useQuery } from "react-query";

function PostCard({ id }) {
  //const [data, setData] = useState({});
  //const [user, setUser] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3000/message/${id}`);
    return res.json();
    //setData(ret);
  };

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:3000/user/${data.id_sender}`);
    const ret = await res.json();
    return ret;
    // setUser(ret);
  };

  function sium() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      console.log(JSON.stringify(position));
    });
  }

  const { data, status } = useQuery(["data", id], fetchData);
  const { data: user, status2 } = useQuery(["user", id], fetchUser, {
    enabled: !!data,
  });

  if (status !== "success") return "Loading...";

  return (
    <div className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-56 max-w-md md:max-w-2xl ">
      <button
        className="btn"
        onClick={() => {
          sium();
        }}
      >
        position
      </button>
      <div className="flex items-start px-4 py-6">
        <img
          className="w-12 h-12 rounded-full object-cover mr-4 shadow"
          src={
            user
              ? user.pro_pic
              : "https://e7.pngegg.com/pngimages/321/641/png-clipart-load-the-map-loading-load.png"
          }
          alt="avatar"
        />
        <div className="">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 -mt-1">
              {user ? user.username : null}
            </h2>
            <small className="text-sm text-gray-700">{data.timestamp}</small>
          </div>
          <div>
            <p>Destinatari</p>
          </div>
          <p className="mt-3 text-gray-700 text-sm">{data.text}</p>
          {data.image ? (
            <img className="my-5 rounded-lg" src={data.image} alt="A tree" />
          ) : null}
          <div className="flex justify-end">
            <ReactionBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
