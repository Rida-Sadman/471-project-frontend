import React, { useEffect, useState } from "react";
import TurfCard from "./TurfCard";
import ShopCard from "./ShopCard";

const Home = () => {
  const [topTurf, setTopTurf] = useState([]);
  const [topSell, setTopSell] = useState([]);

  useEffect(() => {
    fetch(`https://turf-server-seven.vercel.app/turfCollection`)
      .then((res) => res.json())
      .then((data) => {
        console.log("top", data);
        setTopTurf(data);
      });
  }, []);
  useEffect(() => {
    fetch(`https://turf-server-seven.vercel.app/shop`)
      .then((res) => res.json())
      .then((data) => {
        console.log("top", data);
        setTopSell(data);
      });
  }, []);
  const topTurfData = topTurf.filter((item) => item.advertise === "True");
  const shopData = topSell.filter((item) => item.advertise === "True");

  return (
    <div className="mx-10">
      <div className="text-3xl font-bold text-green-800">Top Turf</div>
      <div className="w-20 h-2 rounded-sm bg-green-600"></div>
      <div className="grid  grid-cols-3  ml-20 my-5">
        {topTurfData.map((b) => (
          <TurfCard key={b._id} turfInfo={b}></TurfCard>
        ))}
      </div>
      <div className="text-3xl font-bold text-green-800">Top Selling</div>
      <div className="w-20 h-2 rounded-sm bg-green-600"></div>
      <div className="grid  grid-cols-3  ml-20 my-5">
        {shopData.map((b) => (
          <ShopCard key={b._id} productInfo={b}></ShopCard>
        ))}
      </div>
    </div>
  );
};

export default Home;
