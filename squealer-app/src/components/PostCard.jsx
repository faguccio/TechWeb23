import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import GeoMap from "./GeoMap";

function PostCard({ id }) {
  //const [data, setData] = useState({});
  //const [user, setUser] = useState(null);
  const reactions = [
    { emoji: "😁", amount: 7, id: "A" },
    { emoji: "🙂", amount: 13, id: "B" },
    { emoji: "😑", amount: 2, id: "C" },
    { emoji: "😤", amount: 30, id: "D" },
  ];

  const reactionsUI = reactions.map((reaction) => (
    <div
      className="flex mx-2 items-center text-gray-700 text-sm"
      key={crypto.randomUUID()}
    >
      <button className="btn btn-sm btn-outline text-lg px-2 mr-1">
        {reaction.emoji}
      </button>
      <span>{reaction.amount}</span>
    </div>
  ));

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3000/message/${id}`);
    return res.json();
    //setData(ret);
  };

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:3000/user/${data.sender}`);
    const ret = await res.json();
    return ret;
    // setUser(ret);
  };

  function sium() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
    });
  }

  const { data, status } = useQuery(["data", id], fetchData);
  const { data: user, status2 } = useQuery(["user", id], fetchUser, {
    enabled: !!data,
  });

  if (status !== "success") return "Loading...";

  return (
    <div className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-8 md:max-w-2xl ">
      <div className="flex items-start px-4 py-6">
        <img
          className="w-12 h-12 rounded-full object-cover mr-2 shadow"
          src={
            user
              ? user.propic_path
              : "https://e7.pngegg.com/pngimages/321/641/png-clipart-load-the-map-loading-load.png"
          }
          alt="avatar"
        />
        <div>
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold text-gray-900 -mt-1">
              {user ? user.name : null}
            </h2>
            <small className="text-sm text-gray-700">
              {data.timestamp.split("T")[0]}
            </small>
          </div>
          <div>
            <p>Destinatari</p>
          </div>
          <p className="mt-3 text-gray-700 text-xs md:text-sm">{data.text}</p>
          {data.image_path ? (
            <img
              className="my-5 rounded-lg"
              src={data.image_path}
              alt="A tree"
            />
          ) : null}
          <div className="h-52 md:h-96 z-0 w-auto  shadow-lg rounded-lg shadow-gray-500">
            <GeoMap geolocation={data.geolocation} />
          </div>
          <div className="flex justify-end">
            <div className="mt-4 flex flex-wrap items-center">
              {reactionsUI}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
