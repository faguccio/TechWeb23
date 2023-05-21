import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ChannelBar from "../components/ChannelBar";

function ChannelPage() {
  const params = useParams();
  const [postList, setPostList] = useState([]);
  const pageN = useRef(1);
  const limit = 2;
  const hasMorePages = useRef(true);
  const fetching = useRef(false);

  const [sideOpen, setSideOpen] = useState(false);

  const fetchPost = async (page) => {
    console.log(
      `http://localhost:3000/channels/${params.name}?page=${page}&limit=${limit}`
    );
    const res = await fetch(
      `http://localhost:3000/channels/${params.name}?page=${page}&limit=${limit}`
    );

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
    console.log(params.name);
    setupProtocol();
  }, [params]);

  return (
    <div className="">
      <div className="fixed bg-slate-300 w-full">
        <a
          onClick={() => {
            setSideOpen(!sideOpen);
          }}
          className="btn"
        >
          ch
        </a>
        <div
          className={`${
            sideOpen ? "left-0" : "-left-72"
          } h-screen fixed flex w-72 z-10 md:left-0 md:w-72 lg:w-96 bg-orange-200 duration-300`}
        >
          <div className={`overflow-y-scroll flex flex-1`}>
            <ChannelBar />
          </div>
        </div>
        <div>
          <div className="relative overflow-y-scroll flex justify-center bg-slate-800">
            <div>
              {postList.map((page) => (
                <PostCard id={page} key={crypto.randomUUID()} />
              ))}
              <div className="flex justify-center">
                <button
                  className={
                    hasMorePages.current
                      ? "btn mb-96"
                      : "btn mb-96 btn-disabled"
                  }
                  onClick={handleMorePost}
                >
                  {hasMorePages.current ? "more" : "No more posts"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChannelPage;
