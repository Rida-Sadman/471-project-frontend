import { format } from "date-fns";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthProvider/AuthProvider";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const setDate = new Date();
  const navigate = useNavigate();
  const imageHostKey = "41185f8bc11dfae202e0de3bc10fcabe";
  console.log(imageHostKey);

  const handleAddProduct = (data) => {
    console.log(data);
    const image = data.img[0];
    const formData = new FormData();
    formData.append("image", image);
    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const name = data.productName.toUpperCase();
          const product = {
            productImg: imgData.data.url,
            productBrand: data.productBrand,
            productName: name,
            category: data.category,
            productPrice: data.productPrice,
            description: data.description,
            stock: data.stock,
            date: format(setDate, "PP"),
          };
          console.log(product);
          fetch("https://turf-server-seven.vercel.app/shop", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(product),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              toast.success("Your product added successfully");
              navigate("/dashboard/allProduct");
            });
        }
      });
  };

  return (
    <div>
      <div className="w-full min-h-screen  dark:bg-slate-400">
        <div className="hero-content ">
          <div className=" flex-shrink-0 w-full ">
            <form
              onSubmit={handleSubmit(handleAddProduct)}
              className="card-body"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="form-control">
                  <label className="label ">
                    <span className="label-text">Product Name</span>
                  </label>
                  <input
                    {...register("productName", {
                      required: "Name is required",
                    })}
                    name="productName"
                    type="text"
                    placeholder="Detailed Product Name"
                    className="input input-bordered input-success"
                  />
                </div>
                <div className="form-control">
                  <label className="label ">
                    <span className="label-text">Product Brand</span>
                  </label>
                  <input
                    {...register("productBrand", {
                      required: "Name is required",
                    })}
                    name="productBrand"
                    type="text"
                    placeholder="Product Brand Name"
                    className="input input-bordered input-success"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Select Product Category</span>
                  </label>
                  <select
                    {...register("category", { required: "Name is required" })}
                    name="category"
                    className="select select-bordered select-success w-full bg-white "
                  >
                    <option disabled selected>
                      select an option
                    </option>
                    <option value="Shoe">Shoe</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Select Product Stock</span>
                  </label>
                  <select
                    {...register("stock", { required: "Name is required" })}
                    name="stock"
                    className="select select-bordered select-success w-full bg-white "
                  >
                    <option disabled selected>
                      select an option
                    </option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Product Photo</span>
                  </label>
                  <input
                    type="file"
                    {...register("img", { required: "Image is required" })}
                    className="file-input file-input-bordered file-input-success w-full "
                  />
                  {errors.img && (
                    <p className="text-sm text-red-400 mt-3" role="alert">
                      {errors.img?.message}
                    </p>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Product Price</span>
                  </label>
                  <input
                    {...register("productPrice")}
                    name="productPrice"
                    type="text"
                    placeholder="Your Asking Price"
                    className="input input-bordered input-success"
                  />
                </div>
              </div>

              <div className="form-control mt-3 w-full">
                <label className="label">
                  <span className="label-text">Product Description</span>
                </label>
                <textarea
                  {...register("description")}
                  name="description"
                  className="textarea textarea-bordered textarea-success"
                  placeholder="Product Details"
                ></textarea>
              </div>
              <div className="form-control mt-6">
                <button className="btn bg-green-800 text-white hover:bg-green-600">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
