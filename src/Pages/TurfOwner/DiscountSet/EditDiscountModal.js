import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditDiscountModal = ({ edit, refetch, setEdit }) => {
  console.log(edit);
  const [info, setInfo] = useState([]);
  useEffect(() => {
    fetch(`https://turf-server-seven.vercel.app/turfCollection/${edit}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("all t e", data);
        setInfo(data);
      });
  }, [edit]);

  // Function to handle user input and remove the value from the array

  const handleEdit = (event) => {
    event.preventDefault();
    const form = event.target;
    const discount = form.discount.value;
    const promo = form.promo.value;

    const data = {
      discount: discount,
      promo: promo,
    };

    fetch(`https://turf-server-seven.vercel.app/turfCollection/${edit}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          toast.success("saved changes");
          refetch();
          setEdit(null);
        } else {
          toast.error(data.message);
        }
      });
  };
  return (
    <div>
      <input type="checkbox" id="my-modal-8" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-8"
            className="btn btn-sm btn-circle bg-green-600 text-white absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-xl text-green-800 font-bold">Add Discount</h1>
          <form onSubmit={handleEdit} className="text-center">
            <label className="label">
              <span className="label-text">Turf Name</span>
            </label>
            <input
              name="productName"
              type="text"
              placeholder="Product Name"
              defaultValue={info.name}
              disabled
              className="my-1 input input-border input-success  w-full "
            />
            <label className="label">
              <span className="label-text">Turf Price</span>
            </label>
            <input
              name="productBrand"
              type="text"
              placeholder="Product Name"
              defaultValue={info.price}
              className="my-1 input input-border input-success  w-full "
            />
            <label className="label">
              <span className="label-text">Turf Location</span>
            </label>
            <input
              name="productPrice"
              type="text"
              placeholder="Product Resale Price"
              defaultValue={info.location}
              disabled
              className="my-1 input input-border input-success w-full "
            />
            <label className="label">
              <span className="label-text">Discount</span>
            </label>
            <input
              name="discount"
              type="text"
              placeholder="Turf Discount"
              defaultValue={info.discount && info.discount}
              className="my-1 input input-border input-success w-full "
            />
            <label className="label">
              <span className="label-text">Promo Code</span>
            </label>
            <input
              name="promo"
              type="text"
              placeholder="Turf Promo Code"
              defaultValue={info.promo && info.promo}
              className="my-1 input input-border input-success w-full "
            />

            <input
              type="submit"
              value="save changes"
              className="my-1 cursor-pointer input input-border input-success bg-green-800 text-white w-full hover:bg-green-600"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDiscountModal;
