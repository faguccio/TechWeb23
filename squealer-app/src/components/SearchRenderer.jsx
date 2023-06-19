import PostCard from "../components/PostCard";
import { useEffect, useState, useRef } from "react";
import { Const } from "../utils";

function PostRenderer({ params }) {
  const [postList, setPostList] = useState([]);

  const fetchPost = async () => {
    const uri = `${Const.apiurl}/search/posts?kw=${params.get("kw")}`;
    console.log(uri);
    const res = await fetch(uri);
    const ret = await res.json();
    console.log(ret);
    setPostList(ret);
  };

  useEffect(() => {
    fetchPost();
  }, [params]);

  return (
    <div className="md:mx-4">
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
