import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Calender from "./Calender/Calender";
import toast from "react-hot-toast";
import { FaCalendarAlt } from "react-icons/fa";
import SlotBookingCard from "./SlotBookingCard";
import BookingModal from "./BookingModal";
import { useQuery } from "@tanstack/react-query";
import { ClimbingBoxLoader, SyncLoader } from "react-spinners";
import { format } from "date-fns";
import { FaSearch } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}
function makeDateFormat(date) {
  const monthF = date.getMonth() + 1;
  const yearF = date.getFullYear();
  const dateF = date.getDate();
  return `${yearF}-${monthF}-${dateF}`;
}
function getDisableDays() {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const setMonth = today.getMonth();
  const year = today.getFullYear();
  const dateRange = date + 6;
  const noOfDays = new Date(year, month, 0).getDate();
  const disableDays = [];
  const loopStartDate = parseInt(dateRange) + 1;
  for (let i = 1; i < parseInt(date); i++) {
    disableDays.push(new Date(year, setMonth, i));
  }
  for (let i = parseInt(loopStartDate); i <= parseInt(noOfDays); i++) {
    disableDays.push(new Date(year, setMonth, i));
  }
  return disableDays;
}
const SlotBooking = () => {
  const navigate = useNavigate();
  const [searchTurf, setSearchTurf] = useState("");
  const [searchTurfData, setSearchTurfData] = useState([]);
  const [turfData, setTurfData] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(getDate());
  const [bookingDate, setBookingDate] = useState(new Date());
  const [disabledDaysCalender, setDisabledDaysCalender] = useState(
    getDisableDays()
  );
  const [selected, setSelected] = useState(currentDate);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationData, setSelectedLocationData] = useState([]);
  let formatedBookingDate = format(bookingDate, "PP");
  const {
    data: bookingData = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["bookingData", formatedBookingDate],
    queryFn: async () => {
      const res = await fetch(
        `https://turf-server-seven.vercel.app/allTurf?date=${formatedBookingDate}`
      );
      const data = await res.json();
      return data;
    },
  });
  const handleInputChange = (e) => {
    setSearchTurf(e.target.value);
    console.log(e.target.value);
  };
  const handleSearch = () => {
    // Do something with the searchQuery, e.g., send it to the server for filtering
    console.log("Search query:", searchTurf);
    fetch(
      `https://turf-server-seven.vercel.app/searchTurf?name=${searchTurf}&date=${formatedBookingDate}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("td", data);
        setSearchTurfData(data);
        setSearchTurf("");
      });
  };
  const HandleChangeDate = (e) => {
    let formatDate = makeDateFormat(e);
    setCurrentDate(formatDate);
    setBookingDate(e);
    setOpen(false);
  };
  const buttonClick = () => {
    setOpen(true);
  };
  const handleLocationChange = (v) => {
    const location = v.target.value;
    getLocationData(location);
    setSelectedLocation(location);
  };
  const getLocationData = (data) => {
    fetch(
      `https://turf-server-seven.vercel.app/searchLocation?location=${data}&date=${formatedBookingDate}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("td", data);
        setSelectedLocationData(data);
        setSelectedLocation("");
      });
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center ">
        <SyncLoader color="#36d7b7" />
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="">
        <div className=" flex justify-center items-center my-5 gap-5">
          <div className="flex items-center">
            <div className="flex border border-accent rounded">
              <input
                value={searchTurf}
                onChange={handleInputChange}
                type="text"
                className="block w-full px-4 py-2  bg-white border rounded-md focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Search Turf...."
              />
              <button
                onClick={handleSearch}
                className="px-4 text-white bg-green-800 border-l rounded hover:bg-green-600"
              >
                <FaSearch></FaSearch>
              </button>
            </div>
          </div>
          <div>
            <select
              className="select select-ghost select-accent w-full bg-white select-bordered"
              id="locationDropdown"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <option value="">Select a location</option>
              {bookingData.map((b) => (
                <option key={b._id} value={b.location}>
                  {b.location}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <input
              type="text"
              value={currentDate}
              className="input input-bordered input-accent"
            />
            <label
              className="btn btn-square text-white  bg-green-800 hover:bg-green-500"
              onClick={buttonClick}
              htmlFor="calender-modal"
            >
              <FaCalendarAlt className=" w-1/2 " color="white"></FaCalendarAlt>
            </label>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-4xl text-center text-green-800 font-bold my-10">
          Available Turf on {currentDate}
        </h1>
        {searchTurfData.length > 0 ? (
          <div className="flex items-center justify-center mt-10 gap-5">
            <div
              className="text-5xl cursor-pointer  text-green-800 hover:text-green-500"
              onClick={handleSearch}
            >
              <FaArrowAltCircleLeft></FaArrowAltCircleLeft>
            </div>
            <SlotBookingCard
              key={searchTurfData[0]._id}
              turfInfo={searchTurfData[0]}
              setTurfData={setTurfData}
            ></SlotBookingCard>
          </div>
        ) : (
          <>
            {selectedLocationData.length > 0 ? (
              <div className="flex items-center justify-center mt-10 gap-5">
                <div
                  className="text-5xl cursor-pointer  text-green-800 hover:text-green-500"
                  onClick={() => getLocationData("")}
                >
                  <FaArrowAltCircleLeft></FaArrowAltCircleLeft>
                </div>
                <SlotBookingCard
                  key={selectedLocationData[0]._id}
                  turfInfo={selectedLocationData[0]}
                  setTurfData={setTurfData}
                ></SlotBookingCard>
              </div>
            ) : (
              <>
                {searchTurf && searchTurfData.length === 0 ? (
                  <div className="text-center text-5xl text-gray-400 font-bold mt-20">
                    <h1>No Turf Avaiable</h1>
                  </div>
                ) : (
                  <div className="grid  grid-cols-3  ml-20 my-5">
                    {bookingData.map((b) => (
                      <SlotBookingCard
                        key={b._id}
                        turfInfo={b}
                        setTurfData={setTurfData}
                      ></SlotBookingCard>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {open && (
        <Calender
          currentDate={currentDate}
          HandleChangeDate={HandleChangeDate}
          disabledDaysCalender={disabledDaysCalender}
        ></Calender>
      )}
      {turfData && (
        <BookingModal
          data={turfData}
          date={bookingDate}
          setTurfData={setTurfData}
          refetch={refetch}
        ></BookingModal>
      )}
    </div>
  );
};

export default SlotBooking;
