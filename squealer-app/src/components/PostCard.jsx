import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Const } from "../utils";

import GeoMap from "./GeoMap";
import LoadingSpinner from "./LoadingSpinner";

function PostCard({ id }) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState([false, false]);
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const fetchData = async () => {
    const res = await fetch(`${Const.apiurl}/post/${id}`, {
      headers: {
        "my-unique-session": localStorage.getItem("sessionUUID"),
      },
    });
    return res.json();
    //setData(ret);
  };

  const fetchUser = async () => {
    const res = await fetch(`${Const.apiurl}/user/${data.sender}`);
    const ret = await res.json();
    return ret;
    // setUser(ret);
  };

  const { data, status } = useQuery(["post-card", id], fetchData);

  const { data: user, status2 } = useQuery(["user", id], fetchUser, {
    enabled: !!data,
    onSuccess: (data) => {
      if (data.postsLiked.includes(id)) setLiked([true, false]);
      if (data.postsDisliked.includes(id)) setLiked([false, true]);
    },
  });

  const addLike = useMutation({
    mutationFn: async (rtype) => {
      const data = { type: rtype };
      const res = await fetch(`${Const.apiurl}/post/${id}/likes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.token,
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-card", id] });
    },
  });

  async function sendComment(data) {
    if (!localStorage.token) {
      navigate("/login");
    } else {
      const res = await fetch(`${Const.apiurl}/post/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.token,
        },
        body: JSON.stringify({ text: data.newComment }),
      });
      queryClient.invalidateQueries({ queryKey: ["post-card", id] });
    }
  }

  if (status !== "success")
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex bg-white shadow-lg rounded-lg mx-4 my-8 md:max-w-2xl">
      <div className="flex items-start px-4 py-6 grow">
        <img
          className="w-12 h-12 rounded-full object-cover mr-2 shadow"
          src={
            user ? (
              user.propic_path
            ) : (
              <div
                className="animate-spin radial-progress"
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
          <div className="flex flex-wrap">
            {data.recipients.map((rec) => {
              return (
                <a
                  key={String(crypto.getRandomValues(new Uint32Array(10)))}
                  className="mr-4"
                >
                  {rec}
                </a>
              );
            })}
          </div>
          <p className="mt-3 text-gray-700 text-xs w-full  md:text-sm">
            {data.text}
          </p>
          {data.image_path ? (
            <img
              className="my-5 rounded-lg"
              src={data.image_path}
              alt="A tree"
            />
          ) : null}
          {!!data.geolocation ? (
            <div className="h-52 md:h-96 z-0 w-auto  shadow-lg rounded-lg shadow-gray-500">
              <GeoMap geolocation={[data.geolocation]} />
            </div>
          ) : null}
          <div className="flex justify-end">
            <div className="mt-4 flex flex-wrap items-center">
              <div className="flex mx-2 items-center text-gray-700 text-sm">
                <button
                  className={`btn btn-sm btn-outline text-lg px-2 mr-1 ${
                    liked[0] ? "bg-primary" : ""
                  }`}
                  aria-label="Like Button"
                  onClick={() => {
                    if (!localStorage.token) {
                      navigate("/login");
                    } else {
                      addLike.mutate("positive");
                      setLiked([!liked[0], false]);
                    }
                  }}
                >
                  😁
                </button>
                <span>{data.reactions.positive}</span>
              </div>

              <div className="flex mx-2 items-center text-gray-700 text-sm">
                <button
                  className={`btn btn-sm btn-outline text-lg px-2 mr-1 ${
                    liked[1] ? "bg-primary" : ""
                  }`}
                  aria-label="Dislike Button"
                  onClick={() => {
                    if (!localStorage.token) {
                      navigate("/login");
                    } else {
                      addLike.mutate("negative");
                      setLiked([false, !liked[1]]);
                    }
                  }}
                >
                  😤
                </button>
                <span>{data.reactions.negative}</span>
              </div>

              <div className="flex mx-2 items-center text-gray-700 text-sm">
                <button
                  aria-label="Show comments button"
                  className={`btn btn-sm btn-outline text-lg px-2 mr-1 ${
                    showComments ? "bg-primary" : ""
                  }`}
                  onClick={() => {
                    setShowComments(!showComments);
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3193/3193015.png"
                    className="w-5"
                  />
                </button>
                <span>{data.comments.length}</span>
              </div>
            </div>
          </div>
          <div className={`${showComments ? "" : "hidden"}`}>
            <form
              className="flex flex-col"
              onSubmit={handleSubmit(sendComment)}
            >
              <label htmlFor="newComment">Write a comment</label>
              <input
                type="text"
                id="newComment"
                className="input input-text"
                {...register("newComment", {
                  required: "Comment cannot be empty",
                  minLength: 1,
                })}
              />
              {(errors.newComment?.type === "required" ||
                errors.newComment?.type === "pattern") && (
                <p role="alert">{errors.newComment?.message}</p>
              )}
              <input
                className="btn self-center mt-2 w-fit"
                type="submit"
                value="Send!"
              />
            </form>

            {data.comments.map((comm) => {
              const [name, comment] = comm.split("\n");

              return (
                <div
                  key={String(crypto.getRandomValues(new Uint32Array(10)))}
                  className="flex flex-col items-start shadow-lg rounded-lg p-4 my-4 text-slate-600"
                >
                  <h5 className="text-xl">@{name}</h5>
                  <p className="ml-2">{comment}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
