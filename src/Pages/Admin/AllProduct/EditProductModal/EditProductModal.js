import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditProductModal = ({ edit, refetch, setEdit }) => {
  console.log(edit);
  const initialArray = [0, 10, 20, 30, 40, 50];
  const [yourArray, setYourArray] = useState(initialArray);
  const [info, setInfo] = useState([]);
  useEffect(() => {
    fetch(`https://turf-server-seven.vercel.app/shop/${edit}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setInfo(data);
        handleRemoveValue(data.stock);
      });
  }, [edit]);

  // Function to handle user input and remove the value from the array
  const handleRemoveValue = (valueToRemove) => {
    console.log("v", valueToRemove);
    let data = parseInt(valueToRemove);
    const newArray = yourArray.filter((value) => value !== data);
    setYourArray(newArray);
  };

  const handleEdit = (event) => {
    event.preventDefault();
    const form = event.target;
    const productPrice = form.productPrice.value;
    const stock = form.stock.value;
    const description = form.description.value;

    const data = {
      productPrice: productPrice,
      stock: stock,
      description: description,
    };

    fetch(`https://turf-server-seven.vercel.app/shop/${edit}`, {
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
      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-5"
            className="btn btn-sm btn-circle bg-green-600 text-white absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-xl text-green-800 font-bold">Edit Information</h1>
          <form onSubmit={handleEdit} className="text-center">
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              name="productName"
              type="text"
              placeholder="Product Name"
              defaultValue={info.productName}
              disabled
              className="my-1 input input-border input-success  w-full "
            />
            <label className="label">
              <span className="label-text">Product Brand</span>
            </label>
            <input
              name="productBrand"
              type="text"
              placeholder="Product Name"
              defaultValue={info.productBrand}
              disabled
              className="my-1 input input-border input-success  w-full "
            />
            <label className="label">
              <span className="label-text">Product Price</span>
            </label>
            <input
              name="productPrice"
              type="text"
              placeholder="Product Resale Price"
              defaultValue={info.productPrice}
              className="my-1 input input-border input-success w-full "
            />
            <label className="label">
              <span className="label-text">Product Stock</span>
            </label>
            <select
              name="stock"
              className="select select-bordered select-success w-full"
            >
              <option disabled selected>
                {info.stock}
              </option>
              {yourArray.map((arr) => (
                <option key={arr} value={arr}>
                  {arr}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-success w-full"
              defaultValue={info.description}
              placeholder="Bio"
            ></textarea>
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

export default EditProductModal;
