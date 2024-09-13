import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClimbingBoxLoader, SyncLoader } from "react-spinners";
import { FaSearch } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard/ProductCard";
import BuyModal from "./BuyModal";
import CustomModal from "./CustomModal";

const Shop = () => {
  const navigate = useNavigate();
  const categoryList = ["Shoe", "Clothing", "Accessories"];
  const [searchProduct, setSearchProduct] = useState("");
  const [searchProductData, setSearchProductData] = useState([]);
  const [productData, setproductData] = useState([]);
  const [open, setOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [selectedCategory, setselectedCategory] = useState("");
  const [selectedCategoryData, setselectedCategoryData] = useState([]);
  const {
    data: shopData = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["bookingData"],
    queryFn: async () => {
      const res = await fetch(`https://turf-server-seven.vercel.app/shop`);
      const data = await res.json();
      return data;
    },
  });
  const shoeData = shopData.filter((item) => item.category === "Shoe");
  const clothingData = shopData.filter((item) => item.category === "Clothing");
  const othersData = shopData.filter((item) => item.category === "Accessories");

  const handleInputChange = (e) => {
    setSearchProduct(e.target.value);
    console.log(e.target.value);
  };
  const handleSearch = () => {
    // Do something with the searchQuery, e.g., send it to the server for filtering
    console.log("Search query:", searchProduct);
    fetch(
      `https://turf-server-seven.vercel.app/searchProduct?name=${searchProduct}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("td", data);
        setSearchProductData(data);
        setSearchProduct("");
      });
  };

  const handleCategory = (v) => {
    const productCategory = v.target.value;
    getCategoryData(productCategory);
    setselectedCategory(productCategory);
  };
  const getCategoryData = (data) => {
    fetch(
      `https://turf-server-seven.vercel.app/searchProductCategory?category=${data}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("td", data);
        setselectedCategoryData(data);
      });
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center ">
        <SyncLoader color="#36d7b7" />
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="">
        <div className=" flex justify-center items-center my-5 gap-5">
          <div className="flex items-center">
            <div className="flex border border-accent rounded">
              <input
                value={searchProduct}
                onChange={handleInputChange}
                type="text"
                className="block w-full px-4 py-2  bg-white border rounded-md focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Search Product...."
              />
              <button
                onClick={handleSearch}
                className="px-4 text-white bg-green-800 border-l rounded hover:bg-green-600"
              >
                <FaSearch></FaSearch>
              </button>
            </div>
          </div>
          <div>
            <select
              className="select select-ghost select-accent w-full bg-white select-bordered"
              id="locationDropdown"
              value={selectedCategory}
              onChange={handleCategory}
            >
              <option value="">Select a Category</option>
              {categoryList.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mx-10">
        {searchProductData.length > 0 ? (
          <div className="flex items-center justify-center mt-10 gap-5">
            <div
              className="text-5xl cursor-pointer  text-green-800 hover:text-green-500"
              onClick={handleSearch}
            >
              <FaArrowAltCircleLeft></FaArrowAltCircleLeft>
            </div>
            <ProductCard
              key={searchProductData[0]._id}
              productInfo={searchProductData[0]}
              setproductData={setproductData}
            ></ProductCard>
          </div>
        ) : (
          <>
            {selectedCategory.length > 0 ? (
              <div className="flex items-center justify-center mt-10 gap-5">
                <div
                  className="text-5xl cursor-pointer  text-green-800 hover:text-green-500"
                  onClick={() => setselectedCategory("")}
                >
                  <FaArrowAltCircleLeft></FaArrowAltCircleLeft>
                </div>
                <div className="grid  grid-cols-3 gap-4  ml-20 my-5">
                  {selectedCategoryData.map((b) => (
                    <ProductCard
                      key={b._id}
                      productInfo={b}
                      setproductData={setproductData}
                    ></ProductCard>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {searchProduct && searchProductData.length === 0 ? (
                  <div className="text-center text-5xl text-gray-400 font-bold mt-20">
                    <h1>No Product Avaiable</h1>
                  </div>
                ) : (
                  <React.Fragment>
                    {
                      <div>
                        <div className="text-3xl font-bold text-green-800">
                          Clothing
                        </div>
                        <div className="w-20 h-2 rounded-sm bg-green-600"></div>
                        <div className="grid  grid-cols-3  ml-20 my-5">
                          {clothingData.map((b) => (
                            <ProductCard
                              key={b._id}
                              productInfo={b}
                              setproductData={setproductData}
                            ></ProductCard>
                          ))}
                        </div>
                        <div className="text-3xl font-bold text-green-800">
                          Shoe
                        </div>
                        <div className="w-10 h-2 rounded-sm bg-green-600"></div>
                        <div className="grid  grid-cols-3  ml-20 my-5">
                          {shoeData.map((b) => (
                            <ProductCard
                              key={b._id}
                              productInfo={b}
                              setproductData={setproductData}
                            ></ProductCard>
                          ))}
                        </div>
                        <div className="text-3xl font-bold text-green-800">
                          Accessories
                        </div>
                        <div className="w-20 h-2 rounded-sm bg-green-600"></div>
                        <div className="grid  grid-cols-3  ml-20 my-5">
                          {othersData.map((b) => (
                            <ProductCard
                              key={b._id}
                              productInfo={b}
                              setproductData={setproductData}
                            ></ProductCard>
                          ))}
                        </div>
                      </div>
                    }
                  </React.Fragment>
                )}
              </>
            )}
          </>
        )}
      </div>

      {productData && (
        <BuyModal
          data={productData}
          setproductData={setproductData}
          refetch={refetch}
        ></BuyModal>
      )}
      {productData && (
        <CustomModal
          data={productData}
          setproductData={setproductData}
          refetch={refetch}
        ></CustomModal>
      )}
    </div>
  );
};

export default Shop;
