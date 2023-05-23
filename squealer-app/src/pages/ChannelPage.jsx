import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ChannelBar from "../components/ChannelBar";
import PostRenderer from "../components/PostRenderer";
import SearchBar from "../components/SearchBar";

function ChannelPage() {
  const params = useParams();

  const [sideOpen, setSideOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="fixed z-10 bg-slate-300 w-full">
        <div className="flex justify-center m-2 gap-1">
          <SearchBar
            callback={(query) => {
              navigate(encodeURI(`/search/posts?kw=${query}`));
            }}
          />
          <button
            onClick={() => {
              setSideOpen(!sideOpen);
            }}
            className={`btn btn-md md:hidden`}
          >
            ch
          </button>
        </div>

        <div
          className={`${
            sideOpen ? "left-0" : "-left-72"
          } h-screen fixed flex w-72 md:left-0 md:w-72 bg-secondary duration-300`}
        >
          <div className={`overflow-y-scroll flex flex-1`}>
            <ChannelBar />
          </div>
        </div>
      </div>

      <div
        className="flex flex-col bg-slate-800 md:ml-72 pt-12"
        onClick={() => setSideOpen(false)}
      >
        <PostRenderer params={params} />
      </div>
    </div>
  );
}

export default ChannelPage;
