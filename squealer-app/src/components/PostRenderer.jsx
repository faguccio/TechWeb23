import PostCard from "../components/PostCard";
import { useEffect, useState, useRef } from "react";

function PostRenderer({ params }) {
  const [postList, setPostList] = useState([]);
  const pageN = useRef(1);
  const limit = 2;
  const hasMorePages = useRef(true);
  const [btnText, setBtnText] = useState("more");
  const fetching = useRef(false);

  const fetchPost = async (page) => {
    const uri = `http://localhost:3000/channels/${params.name}?page=${page}&limit=${limit}`;

    console.log(uri);
    const res = await fetch(uri);

    const ret = await res.json();
    return ret;
  };

  const handleMorePost = async () => {
    if (fetching.current || !hasMorePages.current) return;

    fetching.current = true;
    const res = await fetchPost(pageN.current);
    if (res.length > 1) {
      setPostList((postList) => [
        ...new Set(postList.concat(res).filter((post) => post != null)),
      ]);
      pageN.current += 1;
    } else {
      console.log("No more posts to load!");
      hasMorePages.current = false;
      setBtnText("No more post");
    }
    fetching.current = false;
  };

  const setupProtocol = async () => {
    setPostList([]);
    pageN.current = 1;
    hasMorePages.current = true;
    fetching.current = false;
    handleMorePost();
  };

  useEffect(() => {
    //console.log(params.name);
    setupProtocol();
  }, [params]);

  return (
    <div className="flex flex-col items-center  md:mx-4">
      {postList.map((page) => (
        <PostCard id={page} key={crypto.randomUUID()} />
      ))}
      <div className="flex justify-center">
        <button
          className={
            hasMorePages.current ? "btn mb-96" : "btn mb-96 btn-disabled"
          }
          onClick={handleMorePost}
        >
          {btnText}
        </button>
      </div>
    </div>
  );
}

export default PostRenderer;
