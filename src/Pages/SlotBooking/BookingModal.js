import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import { sl } from "date-fns/locale";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const BookingModal = ({ data, date, setTurfData, refetch }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { user } = useContext(AuthContext);
  const { name, slots, img, location, price } = data;
  const [userRole, setUserRole] = useState([]);
  const formatedDate = format(date, "PP");
  useEffect(() => {
    fetch(`https://turf-server-seven.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserRole(data);
      });
  }, [user?.email]);
  const userInfo = userRole[0];

  const handleBook = (event) => {
    event.preventDefault();
    const clickedButton = event.nativeEvent.submitter;
    const form = event.target;
    const slot = form.slot.value;
    const button = form.book.value;
    console.log(button);
    const alternativePhone = form.alternativePhone.value;
    const bookingData = {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      alternativePhone: alternativePhone,
      bookingDate: formatedDate,
      turfName: name,
      slot: slot,
      turfImg: img,
      turfLocation: location,
      turfPrice: price,
    };
    // Check the name attribute of the clicked button
    if (clickedButton.name === "hold") {
      // Handle Hold Slot button click
      console.log("Hold Slot button clicked");
      fetch(`https://turf-server-seven.vercel.app/hold`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            toast.success("Your Booking is on hold!");
            refetch();
          }
        });
      // Perform the necessary actions for Hold Slot
    } else if (clickedButton.name === "book") {
      // Handle Book Slot button click
      console.log("Book Slot button clicked");
      fetch(`https://turf-server-seven.vercel.app/booking`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            toast.success("Your Booking is confirmed");
            refetch();
          }
        });
      // Perform the necessary actions for Book Slot
    }
    setTurfData(null);
  };

  return (
    <div>
      <input type="checkbox" id="booking-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label
            htmlFor="booking-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-2xl text-green-800 font-bold">{name}</h1>

          <form onSubmit={handleBook} className="grid grid-cols-1 gap-3 mt-10">
            <input
              type="text"
              value={formatedDate}
              disabled
              className="input input-bordered w-full input-accent"
            />
            <select
              name="slot"
              className="select select-bordered w-full select-accent"
            >
              {slots.map((slot, i) => (
                <option key={i} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={userInfo?.name}
              disabled
              placeholder="Type here"
              className="input input-bordered w-full input-accent"
            />
            <input
              type="text"
              value={userInfo?.email}
              disabled
              placeholder="Type here"
              className="input input-bordered w-full input-accent"
            />
            <input
              value={userInfo?.phone}
              type="text"
              disabled
              placeholder="Type here"
              className="input input-bordered w-full input-accent"
            />
            <input
              type="text"
              name="alternativePhone"
              placeholder="Type Alternative Phone Number"
              className="input input-bordered w-full input-accent"
            />
            <input
              name="hold"
              type="submit"
              value="Hold Slot"
              className="cursor-pointer mt-2 input input-border input-accent bg-red-700 hover:bg-red-500 text-white w-full "
            />
            <input
              name="book"
              type="submit"
              value="Book Slot"
              className="cursor-pointer mt-2 input input-border input-accent bg-green-800 hover:bg-green-500 text-white w-full "
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
