import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";

const MyOrder = () => {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState([]);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(null);
  const [btn, setBtn] = useState(false);
  const crntUserMail = user.email;
  const [allOrders, setAllOrders] = useState([]);
  useEffect(() => {
    fetch(`https://turf-server-seven.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserRole(data);
      });
  }, [user?.email]);

  const {
    data: products = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["user", crntUserMail],
    queryFn: async () => {
      let res = await fetch(
        `https://turf-server-seven.vercel.app/shopOrder?email=${crntUserMail}`
      );
      let data = await res.json();
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

  const handleDelete = (id, name) => {
    const proceed = window.confirm(
      `Are you sure you want to delete order of ${name}?`
    );
    if (proceed) {
      fetch(`https://turf-server-seven.vercel.app/shopOrder/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            toast.success(`${name} has been deleted successfully `);
            refetch();
          }
        });
    }
  };

  return (
    <div>
      <div className="overflow-x-auto mx-5">
        {products.length > 0 ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center"></th>
                <th className="text-center">Order Information</th>
                <th className="text-center">Total Price</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={product._id} setEdit={setEdit} setBtn={setBtn}>
                  <th className="text-center">{i + 1}</th>
                  <td className="text-center">
                    <div className="flex items-center gap-3 justify-center">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={product?.productImg}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{product.productName}</div>
                        <div className="text-sm opacity-50">
                          {product.productPcs}Pcs
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    ৳{" "}
                    {parseInt(product.productPrice) *
                      parseInt(product.productPcs)}
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() =>
                        handleDelete(product._id, product.productName)
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
          <h1 className="text-center text-3xl text-gray-400 my-20 font-bold">
            Please Order A Product!
          </h1>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
