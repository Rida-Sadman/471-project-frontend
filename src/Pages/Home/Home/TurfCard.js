import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const TurfCard = ({ turfInfo }) => {
  const { name, slots, img, location, price, promo, discount } = turfInfo;
  console.log(img);
  return (
    <div className="card w-96 h-4/5 bg-gray-200 shadow-lg">
      <figure>
        <img src={img} alt="Turf Photo " className="w-full" />
      </figure>
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title text-green-800 font-bold">{name}</h2>
          {discount ? (
            <div
              className="flex gap-1 items-center tooltip"
              data-tip={`Get ${discount}% off`}
            >
              <h1 className="text-orange-500 text-md font-bold">promo:</h1>
              <div className="badge bg-red-500 text-white">{promo}</div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex items-center justify-around">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl text-red-700 font-extrabold">৳</h1>
            <h1 className="text-xl">{price}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-2xl text-red-700"></FaMapMarkerAlt>
            <h1>{location}</h1>
          </div>
        </div>
        <p className="text-center flex justify-center items-center gap-1 my-5">
          <h1 className="text-red-700 font-bold text-2xl">{slots.length} </h1>
          <h2 className="text-xl">
            {" "}
            {slots.length > 1 ? " spaces" : " space"} Available
          </h2>
        </p>
      </div>
    </div>
  );
};

export default TurfCard;
