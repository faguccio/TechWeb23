import PostCard from "../components/PostCard";
import { useEffect, useState, useRef } from "react";
import { Const } from "../utils";
import { useNavigate } from "react-router-dom";

function PostRenderer({ params }) {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);
  const [chanList, setChanList] = useState([]);

  const fetchPost = async () => {
    const uri = `${Const.apiurl}/search/posts?kw=${params.get("kw")}`;
    console.log(uri);
    const res = await fetch(uri);
    const ret = await res.json();
    console.log(ret);
    setPostList(ret.posts);
    setChanList(ret.channels);
  };

  useEffect(() => {
    fetchPost();
  }, [params]);

  return (
    <div className="md:mx-4">
      {chanList.map((chan) => {
        console.log(chan);
        return (
          <div
            className="flex bg-white shadow-lg rounded-lg mx-4 my-8 md:max-w-2xl"
            key={String(crypto.getRandomValues(new Uint32Array(10)))}
          >
            <button
              className="text-2xl m-4 text-blue-400 hover:decoration-4 text-black self-center underline"
              onClick={(e) => {
                e.preventDefault();
                let dest = chan;
                if (dest[0] == "#") {
                  dest = dest.substring(1);
                }
                navigate(`/channels/${dest}`);
              }}
            >
              Channel: {chan}
            </button>
          </div>
        );
      })}
      {postList.map((page) => (
        <PostCard
          id={page}
          key={String(crypto.getRandomValues(new Uint32Array(10)))}
        />
      ))}
    </div>
  );
}

export default PostRenderer;
