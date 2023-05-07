import { useEffect, useState } from "react";
import { useQuery } from "react-query";

function PostCard({ id }) {
  //const [data, setData] = useState({});
  //const [user, setUser] = useState(null);
  const smileEmoji = "🙂";

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
      console.log(JSON.stringify(position));
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
          className="w-12 h-12 rounded-full object-cover mr-4 shadow"
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
          <p className="mt-3 text-gray-700 text-xs">{data.text}</p>
          {data.image_path ? (
            <img
              className="my-5 rounded-lg"
              src={data.image_path}
              alt="A tree"
            />
          ) : null}
          <div className="flex justify-end"></div>
          <div className="mt-4 flex items-center">
            <div className="flex mx-2 items-center text-gray-700 text-sm mr-3">
              <button className="btn btn-sm text-lg">{smileEmoji}</button>
              <span>12</span>
            </div>
            <div className="flex mx-2 items-center text-gray-700 text-sm">
              <button className="text-lg">{smileEmoji}</button>
              <span>8</span>
            </div>
            <div className="flex mx-2 items-center text-gray-700 text-sm">
              <button className="text-lg">{smileEmoji}</button>
              <span>8</span>
            </div>
            <div className="flex mx-2 items-center text-gray-700 text-sm">
              <button className="text-lg">{smileEmoji}</button>
              <span>8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
