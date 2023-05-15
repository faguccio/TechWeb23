import PostCard from "../components/PostCard";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import InfiniteScroll from "react-infinite-scroller";

function HomePage() {
  const userID = "64569d259d19f7f3611babe1";
  const [postList, setPostList] = useState([]);
  const pageN = useRef(1);
  const hasMorePages = useRef(true);
  const fetching = useRef(false);

  const limit = 2;
  const fetchPost = async (page) => {
    console.log(
      `http://localhost:3000/home/post/${userID}?page=${page}&limit=${limit}`
    );
    const res = await fetch(
      `http://localhost:3000/home/post/${userID}?page=${page}&limit=${limit}`
    );

    const ret = await res.json();
    return ret;
  };

  const handleMorePost = async () => {
    if (fetching.current || !hasMorePages.current) return;

    fetching.current = true;
    const res = await fetchPost(pageN.current);
    if (res.length > 1) {
      setPostList(postList.concat(res).filter((post) => post != null));
      pageN.current += 1;
    } else {
      console.log("No more posts to load!");
      hasMorePages.current = false;
    }
    fetching.current = false;
  };

  useEffect(() => {
    handleMorePost();
  }, []);

  return (
    <div className="">
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
          {hasMorePages.current ? "more" : "No more posts"}
        </button>
      </div>
    </div>
  );
}

export default HomePage;
