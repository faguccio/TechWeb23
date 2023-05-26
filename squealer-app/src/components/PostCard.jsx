import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import GeoMap from "./GeoMap";
import LoadingSpinner from "./LoadingSpinner";

function PostCard({ id }) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState([false, false]);

  const positiveR = {
    emoji: "😁",
    type: "positive",
    alt: "Like Button",
    amount: 0,
  };
  const negativeR = {
    emoji: "😤",
    type: "negative",
    alt: "Dislike Button",
    amount: 0,
  };

  const reactions = [positiveR, negativeR];

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3000/post/${id}`);
    return res.json();
    //setData(ret);
  };

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:3000/user/${data.sender}`, {
      headers: { Authorization: localStorage.token },
    });
    const ret = await res.json();
    return ret;
    // setUser(ret);
  };

  function sium() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
    });
  }

  const { data, status } = useQuery(["post-card", id], fetchData);

  const { data: user, status2 } = useQuery(["user", id], fetchUser, {
    enabled: !!data,
  });

  const addLike = useMutation({
    mutationFn: async (rtype) => {
      const data = { type: rtype, increase: true };
      const res = await fetch(`http://localhost:3000/post/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-card", id] });
    },
  });

  if (status !== "success")
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  const reactionsUI = reactions.map((reaction) => (
    <div
      className="flex mx-2 items-center text-gray-700 text-sm"
      key={crypto.randomUUID()}
    >
      <button
        className="btn btn-sm btn-outline text-lg px-2 mr-1"
        aria-label={reaction.alt}
        onClick={() => {
          addLike.mutate(reaction.type);
        }}
      >
        {reaction.emoji}
      </button>
      <span>
        {reaction.type === "positive"
          ? data.reactions.positive
          : data.reactions.negative}
      </span>
    </div>
  ));

  return (
    <div className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-8 md:max-w-2xl ">
      <div className="flex items-start px-4 py-6">
        <img
          className="w-12 h-12 rounded-full object-cover mr-2 shadow"
          src={
            user ? (
              user.propic_path
            ) : (
              <div
                class="animate-spin radial-progress"
                style="--value:70;"
              ></div>
            )
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
          {!!data.geolocation ? (
            <div className="h-52 md:h-96 z-0 w-auto  shadow-lg rounded-lg shadow-gray-500">
              <GeoMap geolocation={data.geolocation} />
            </div>
          ) : null}
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
