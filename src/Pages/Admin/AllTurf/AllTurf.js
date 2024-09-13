import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { AuthContext } from "../../../Context/AuthProvider/AuthProvider";
import EditAllTurfModal from "./EditAllTurfModal/EditAllTurfModal";

const AllTurf = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(null);
  const [btn, setBtn] = useState(false);
  const crntUserMail = user.email;
  const {
    data: products = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["user", crntUserMail],
    queryFn: async () => {
      const res = await fetch(
        `https://turf-server-seven.vercel.app/turfCollection`
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

  const handleDelete = (id, name) => {
    const proceed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (proceed) {
      fetch(`https://turf-server-seven.vercel.app/shop/${id}`, {
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

  const handleAdvertise = (
    id,
    productName,
    productImg,
    productPrice,
    productLocation
  ) => {
    fetch(`https://turf-server-seven.vercel.app/advertise?productId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length) {
          toast.error("Product is already Advertised!");
        } else {
          const advertiseData = {
            productId: id,
            productName: productName,
            productImg: productImg,
            productPrice: productPrice,
            productLocation: productLocation,
          };
          fetch("https://turf-server-seven.vercel.app/advertise", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(advertiseData),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              fetch(
                `https://turf-server-seven.vercel.app/turfCollection/${id}`,
                {
                  method: "PATCH",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify({ advertise: "True" }),
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  if (data.acknowledged) {
                    toast.success(
                      `product ${productName} is added on Advertise section`
                    );
                    refetch();
                  } else {
                    console.log(data.message);
                  }
                });
            });
        }
      });
  };
  const handleUnadvertise = (id, productName) => {
    const proceed = window.confirm(
      `Are you sure you want to remove ${productName} from Advertise section?`
    );
    if (proceed) {
      fetch(`https://turf-server-seven.vercel.app/advertise/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            fetch(`https://turf-server-seven.vercel.app/turfCollection/${id}`, {
              method: "PATCH",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ advertise: "False" }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                if (data.acknowledged) {
                  toast.success(`${productName} has been removed successfully`);
                  refetch();
                } else {
                  console.log(data.message);
                }
              });
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
                <th className="text-center">Turf Name</th>
                <th className="text-center">Turf Price</th>
                <th className="text-center">Advertise</th>
                <th className="text-center">Edit</th>
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
                    {product.advertise === "True" ? (
                      <button
                        className={`btn-xs rounded-md bg-red-800  text-white `}
                        onClick={() =>
                          handleUnadvertise(product._id, product.name)
                        }
                      >
                        Advertised
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleAdvertise(
                            product._id,
                            product.name,
                            product.img,
                            product.price,
                            product.location
                          )
                        }
                        className={`btn-xs rounded-md bg-green-800 text-white  hover:bg-green-600 `}
                      >
                        Advertise
                      </button>
                    )}
                  </td>
                  <td className="text-center">
                    <label
                      onClick={() => setEdit(product._id)}
                      htmlFor="my-modal-6"
                    >
                      <FaEdit className="text-green-800 cursor-pointer text-xl mx-auto hover:text-2xl"></FaEdit>
                    </label>
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
              {edit && (
                <EditAllTurfModal
                  edit={edit}
                  setEdit={setEdit}
                  refetch={refetch}
                ></EditAllTurfModal>
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

export default AllTurf;
