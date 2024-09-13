import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaTrashAlt, FaWindows } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import { AuthContext } from "../../../Context/AuthProvider/AuthProvider";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const MonthlyCalculation = () => {
  const { user } = useContext(AuthContext);
  const crntUserName = user?.displayName;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const generateMonthsArray = (numberOfMonths) => {
    const monthsArray = [];

    for (let i = 0; i < numberOfMonths; i++) {
      // Create a date for the 1st day of each month
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + i);
      currentDate.setDate(1);

      // Format the date using date-fns
      const formattedMonth = format(currentDate, "MMM yyyy", { locale: enUS });

      monthsArray.push(formattedMonth);
    }

    return monthsArray;
  };

  // Example: Generate an array of 12 months
  const monthsArray = generateMonthsArray(12);
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
  const handleMonth = (data) => {
    const month = data.target.value;
    setSelectedMonth(month);
  };
  let totalPriceLoop = 0;
  for (let i = 0; i < bookings.length; i++) {
    totalPriceLoop += parseInt(bookings[i].turfPrice);
  }

  console.log("Total Price (Using Loop):", totalPriceLoop);

  // Using the reduce function
  const totalPriceReduce = bookings.reduce((acc, item) => acc + item.price, 0);

  return (
    <div>
      <div className="overflow-x-auto mx-5 mt-10">
        <div>
          <div>
            Total Booked Slot:{" "}
            <span className="text-red-800">{bookings.length}</span>
          </div>
          <div>
            Total Price: <span className="text-red-800">৳{totalPriceLoop}</span>
          </div>
        </div>
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

export default MonthlyCalculation;
