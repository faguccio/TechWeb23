import PostCard from "../components/PostCard";
import { useEffect, useState, useRef } from "react";

function PostRenderer({ params }) {
  const [postList, setPostList] = useState([]);

  const fetchPost = async () => {
    const uri = `http://localhost:3000/search/posts?kw=${params.get("kw")}`;
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
        <PostCard id={page} key={crypto.randomUUID()} />
      ))}
    </div>
  );
}

export default PostRenderer;
