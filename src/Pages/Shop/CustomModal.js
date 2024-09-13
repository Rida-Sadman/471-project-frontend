import React, { useContext, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CustomModal = ({ data, setproductData, refetch }) => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { user } = useContext(AuthContext);
  const {
    _id,
    productImg,
    productName,
    productBrand,
    productPrice,
    description,
    stock,
  } = data;
  const [userRole, setUserRole] = useState([]);
  useEffect(() => {
    fetch(`https://turf-server-seven.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserRole(data);
      });
  }, [user?.email]);
  const userInfo = userRole[0];

  const handleBuy = (event) => {
    event.preventDefault();
    const form = event.target;
    const productPcs = form.productPcs.value;
    const productPcsInt = parseInt(productPcs);
    const stockInt = parseInt(stock);
    const purchaseData = {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      productName: productName,
      productPrice: productPrice,
      productPcs: productPcs,
      description: form.description.value,
      productImg: productImg,
    };

    fetch(`https://turf-server-seven.vercel.app/customOrder`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success("Your Order is requested to Admin");
          navigate("/dashboard/customOrder");
        }
      });

    setproductData(null);
  };

  return (
    <div>
      <input type="checkbox" id="custom-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label
            htmlFor="custom-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-2xl text-green-800 font-bold">{productName}</h1>

          <form onSubmit={handleBuy} className="grid grid-cols-1 gap-3 mt-10">
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
              name="productName"
              value={productName}
              disabled
              placeholder="Type Alternative Phone Number"
              className="input input-bordered w-full input-accent"
            />
            <input
              type="text"
              name="productPrice"
              value={`৳${productPrice}`}
              disabled
              placeholder="Type Alternative Phone Number"
              className="input input-bordered w-full input-accent"
            />
            <input
              type="text"
              name="productPcs"
              placeholder="Type Your Pcs"
              className="input input-bordered w-full input-accent"
            />
            <textarea
              name="description"
              className="textarea textarea-success w-full"
              placeholder="please write your condition...."
            ></textarea>
            <input
              name="book"
              type="submit"
              value="Order"
              className="cursor-pointer mt-2 input input-border input-accent bg-green-800 hover:bg-green-500 text-white w-full "
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
