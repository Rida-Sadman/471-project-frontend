import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaTrashAlt, FaWindows } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import { FaDownload } from "react-icons/fa";

const HoldSlot = () => {
  const { user } = useContext(AuthContext);
  const crntUserMail = user?.email;
  const {
    data: bookings = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch(
        `https://turf-server-seven.vercel.app/hold?customerEmail=${crntUserMail}`
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
      fetch(`https://turf-server-seven.vercel.app/hold/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            toast.success(`product ${name} booking has successfully deleted`);
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
                  Turf Information
                </th>
                <th className="text-center text-green-800 font-bold ">
                  Slot Time
                </th>
                <th className="text-center text-green-800 font-bold ">
                  Slot Price
                </th>
                <th className="text-center text-green-800 font-bold ">
                  Proceed To Pay
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
                    <div className="flex items-center gap-3 justify-center">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={booking?.turfImg}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{booking?.turfName}</div>
                        <div className="text-sm opacity-50">
                          {booking?.turfLocation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">{booking?.slot}</td>
                  <td className="text-center">
                    <span className="text-xl">৳</span> {booking?.turfPrice}
                  </td>
                  <td className="text-center">
                    <button>
                      <FaDownload className="text-green-800 hover:text-xl"></FaDownload>
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
          <div className="text-center mt-28 text-3xl font-bold text-gray-400">
            Please Hold a Slot!
          </div>
        )}
      </div>
    </div>
  );
};

export default HoldSlot;
