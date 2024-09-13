import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { AuthContext } from "../../../Context/AuthProvider/AuthProvider";
import EditDiscountModal from "./EditDiscountModal";

const TurfOwnerDiscount = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(null);
  const [btn, setBtn] = useState(false);
  const crntUserMail = user.email;
  const name = user.displayName;
  const userName = name.toUpperCase();
  const {
    data: products = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["user", userName],
    queryFn: async () => {
      const res = await fetch(
        `https://turf-server-seven.vercel.app/turfCollection?name=${userName}`
      );
      const data = await res.json();
      console.log("discount", data);
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

  return (
    <div>
      <div className="overflow-x-auto mx-5">
        {products.length > 0 ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">Turf Name</th>
                <th className="text-center">Turf Price</th>
                <th className="text-center">Discount</th>
                <th className="text-center">Edit</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={product._id} setEdit={setEdit} setBtn={setBtn}>
                  <td className="text-center">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={product.img}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-sm opacity-50">
                          {product.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">৳ {product.price}</td>
                  <td className="text-center">
                    <div>
                      <div className="font-bold">
                        {product.discount === ""
                          ? "0 %"
                          : `${product.discount}%`}
                      </div>
                      <div className="text-sm opacity-50">
                        {product.promo === "" ? "no promo" : `${product.promo}`}
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <label
                      onClick={() => setEdit(product._id)}
                      htmlFor="my-modal-8"
                    >
                      <FaEdit className="text-green-800 cursor-pointer text-xl mx-auto hover:text-2xl"></FaEdit>
                    </label>
                  </td>
                </tr>
              ))}
              {edit && (
                <EditDiscountModal
                  edit={edit}
                  setEdit={setEdit}
                  refetch={refetch}
                ></EditDiscountModal>
              )}
            </tbody>
          </table>
        ) : (
          <h1 className="text-center text-3xl text-gray-400 my-20 font-bold">
            Please Add A Product!
          </h1>
        )}
      </div>
    </div>
  );
};

export default TurfOwnerDiscount;
