import React, { useContext, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const BuyModal = ({ data, setproductData, refetch }) => {
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
      productImg: productImg,
    };
    if (productPcsInt > stockInt) {
      toast.error(`Sorry we have only ${stock} pcs left!`);
    } else {
      let remainingStock = stockInt - productPcsInt;
      fetch(`https://turf-server-seven.vercel.app/shopOrder`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            fetch(`https://turf-server-seven.vercel.app/shop/${_id}`, {
              method: "PATCH",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ stock: remainingStock }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                if (data.acknowledged) {
                  toast.success("Your Purchase is confirmed");
                  refetch();
                } else {
                  toast.error(data.message);
                }
              });
          }
        });
    }
    setproductData(null);
  };

  return (
    <div>
      <input type="checkbox" id="buy-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label
            htmlFor="buy-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h1 className="text-2xl text-green-800 font-bold">Product Cart</h1>

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

            <input
              name="book"
              type="submit"
              value="Purchase"
              className="cursor-pointer mt-2 input input-border input-accent bg-green-800 hover:bg-green-500 text-white w-full "
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
