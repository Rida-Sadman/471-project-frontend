import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaTrashAlt, FaWindows } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import { FaDownload } from "react-icons/fa";

const TurfOwnerBooking = () => {
  const { user } = useContext(AuthContext);
  const crntUserName = user?.displayName;
  const {
    data: bookings = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch(
        `https://turf-server-seven.vercel.app/bookedData?name=${crntUserName}`
      );
      const data = await res.json();
      return data;
    },
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <ClimbingBoxLoader color="#36d7b7" />
      </div>
    );
  }

  // const handleAdmin = id => {
  //     fetch(`https://mobile-broker-server.vercel.app/users/admin/${id}`, {
  //         method: 'PUT',
  //         headers: {
  //             authorization: `bearer ${localStorage.getItem('accessToken')}`
  //         }
  //     })
  //         .then(res => res.json())
  //         .then(data => {
  //             if (data.modifiedCount > 0) {
  //                 toast.success('user added to admin list')
  //                 refetch()
  //             }
  //         })
  // }

  const bookingDelete = (id, name, slot) => {
    const proceed = window.confirm(
      `Are you sure you want to delete ${name}, slot: ${slot}?`
    );
    if (proceed) {
      console.log("dltId", id);
      fetch(`https://turf-server-seven.vercel.app/booking/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            toast.success(
              ` ${name} booking in ${slot} has successfully deleted`
            );
            refetch();
          }
        });
    }
  };
  const bookingFinish = (id, name, slot) => {
    const proceed = window.confirm(
      `Are you sure game ${name}, slot: ${slot} is finished?`
    );
    if (proceed) {
      fetch(`https://turf-server-seven.vercel.app/booking/${id}`, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.modifiedCount > 0) {
            toast.success(
              `${name} booking in ${slot} has successfully finished`
            );
            refetch();
          }
        });
    }
  };

  return (
    <div>
      <div className="overflow-x-auto mx-5 mt-10">
        {bookings?.length > 0 ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center text-green-800 font-bold "></th>
                <th className="text-center text-green-800 font-bold ">
                  Player Information
                </th>
                <th className="text-center text-green-800 font-bold ">
                  Player Contact Number
                </th>
                <th className="text-center text-green-800 font-bold ">
                  Slot Time
                </th>
                <th className="text-center text-green-800 font-bold ">
                  Slot Price
                </th>
                <th className="text-center text-green-800 font-bold ">
                  Game Over
                </th>
                <th className="text-center text-green-800 font-bold ">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => (
                <tr key={booking._id}>
                  <th className="text-center">{i + 1}</th>
                  <td>
                    <div className="text-center">
                      <div className="font-bold">{booking?.name}</div>
                      <div className="text-sm opacity-50">{booking?.email}</div>
                    </div>
                  </td>
                  <td className="text-center">
                    {booking?.phone}/{booking?.alternativePhone}
                  </td>
                  <td className="text-center">
                    <div>
                      <div className="font-bold">{booking?.slot}</div>
                      <div className="text-sm opacity-50">
                        {booking?.bookingDate}
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    <span className="text-xl">৳</span> {booking?.turfPrice}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() =>
                        bookingFinish(
                          booking?._id,
                          booking?.turfName,
                          booking?.slot
                        )
                      }
                      className="btn btn-xs bg-green-800 text-white"
                      disabled={booking?.gameStatus === "over" ? true : false}
                    >
                      Finished
                    </button>
                  </td>
                  <td className="text-center">
                    {" "}
                    <button
                      onClick={() =>
                        bookingDelete(
                          booking?._id,
                          booking?.turfName,
                          booking?.slot
                        )
                      }
                    >
                      <FaTrashAlt className="text-red-800 hover:text-xl"></FaTrashAlt>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-25 text-3xl font-bold text-gray-400">
            No Available Data!
          </div>
        )}
      </div>
    </div>
  );
};

export default TurfOwnerBooking;
