import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { useQuery, useInfiniteQuery, useQueryClient } from "react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import InfiniteScroll from "react-infinite-scroller";

function HomePage() {
  const userID = "64569d259d19f7f3611babe1";
  const [page, setPage] = useState(1);
  const limit = 2;
  const fetchPost = async (page) => {
    const res = await fetch(
      `http://localhost:3000/home/post/${userID}?page=${page}&limit=${limit}`
    );

    const ret = await res.json();
    return ret;
  };

  /*
  useEffect(() => {
    let fetching = false;
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;

      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true;
        console.log(hasNextPage);
        if (hasNextPage) {
          let res = await fetchNextPage();
        }
        fetching = false;
      }
    };

    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);*/

  const { data, error, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPost(pageParam),
    getNextPageParam: (lastPage, pages) => {
      console.log(lastPage);
      lastPage.nextPage != "no-more-pages"
        ? lastPage.nextPage
        : lastPage.nextPage;
    },
  });

  if (status === "loading") return <LoadingSpinner />;

  if (status === "error") return <h4>Ups!, {error}</h4>;

  return (
    <div>
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {data.pages.map((page) =>
          page.pages.map((mid) => (
            <PostCard id={mid} key={crypto.randomUUID()} />
          ))
        )}
      </InfiniteScroll>
    </div>
  );
}

export default HomePage;
