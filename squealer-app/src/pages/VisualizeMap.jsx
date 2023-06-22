import { useState, useEffect, useRef } from "react";
import { Const, getDistanceFromLatLonInKm, kmToCal } from "../utils";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import GeoMap from "../components/GeoMap";

function VisualizeMap() {
  const params = useParams();
  const navigate = useNavigate();
  const [showSpin, setShowSpin] = useState(true);
  const [bigMap, setBigMap] = useState(null);
  const [totDist, setTotDist] = useState(0);

  useEffect(() => {
    if (params.name != "info") {
      handleSearch(params.name);
    }
  }, [params]);

  const handleSearch = async (name) => {
    let res = await fetch(`${Const.apiurl}/channels/${name}/available`);
    res = await res.json();

    if (res) return;

    res = await fetch(`${Const.apiurl}/channels/${name}`);
    res = await res.json();

    const posts = await Promise.all(
      res.map(async (id) => {
        let post = await fetch(`${Const.apiurl}/post/${id}`);
        post = await post.json();
        return post;
      })
    );

    const markers = posts.map((post) => {
      let ts = post.timestamp.split("T");
      ts = ts[0] + " " + ts[1].split(".")[0];
      post.geolocation.timestamp = ts;
      return post.geolocation;
    });

    setBigMap(markers);
    setShowSpin(false);
    computeTotDist(markers);
  };

  function computeTotDist(markers) {
    let totDist = 0;
    for (let i = 0; i < markers.length - 1; i++) {
      totDist += getDistanceFromLatLonInKm(
        markers[i].lat,
        markers[i].lon,
        markers[i + 1].lat,
        markers[i + 1].lon
      );
    }
    setTotDist(totDist);
  }

  const firstPiece = (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-4xl md:text-5xl font-semibold">Titolo</h1>
      <div className="shadow-2xl">
        <SearchBar
          callback={(query) => {
            if (!query) return;
            navigate(`/channels/${query}/visualize`);
          }}
        />
      </div>
    </div>
  );

  if (params.name == "info") {
    return (
      <div className="flex flex-col items-center mt-8">
        {firstPiece}
        <p className="mt-8">Spiegazione di come funziona la pagina TODO</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-8 mx-8 mb-52">
      {firstPiece}
      <div className="mt-8 w-48">
        <div
          className={`${showSpin ? "" : "hidden"} flex flex-col items-center`}
        >
          <LoadingSpinner />
          <p>It could take a bit...</p>
        </div>
      </div>
      <div className={`${showSpin ? "hidden" : ""} flex flex-col items-center`}>
        <h2 className="text-2xl">Total distance</h2>
        <p className="text-md">
          You have walked for {totDist.toFixed(2)}km! This means that you burnt
          at least{" "}
          <span className="bg-accent text-black rounded-sm p-1">
            {kmToCal(totDist).toFixed(2)} kcal
          </span>
        </p>
        <p>
          This is based on a 70kg average person. Moreover the distance
          calculated is a low approximation, in the future we will implement a
          more precise way to get the total distance
        </p>
      </div>
      <div className="mt-8 w-full h-96">
        {bigMap ? <GeoMap geolocation={bigMap} /> : null}
      </div>
    </div>
  );
}

export default VisualizeMap;
