import React from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import axios from "@/libs/axios";
import { type ProductData } from "@/classes/Product";
import Image from "next/image";

type Props = {
  productData: ProductData;
};

export default function Product({ productData }: Props) {
  return (
    <HomeLayout titile={productData.name}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-9 md:py-1 lg:max-w-7xl lg:px-8">
        <ProductCard data={productData} />
      </div>
    </HomeLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productId = context.query["product.tsx"][0] as string;

  const res = await axios.get(`/product`);
  const product = (await res.data) as ProductData[];

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=59"
  );

  //@ts-ignore
  const allProduct = product.data as ProductData[];

  let filtered = allProduct.find((item) => item.id === productId);

  console.log(filtered);

  return {
    props: { productData: filtered },
  };
};

export const ProductCard = ({ data }: { data?: ProductData }) => {
  return (
    <React.Fragment>
      <div className="max-w-6xl px-4 mx-auto lg:py-8 md:px-6">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 md:w-1/2 ">
            <div className="sticky top-0 z-50 overflow-hidden ">
              <div className="relative mb-6 lg:mb-10 lg:h-2/4 ">
                <img
                  src={data.image3}
                  alt=""
                  className="object-cover w-full lg:h-full "
                />
              </div>
              <div className="flex-wrap hidden md:flex ">
                <div className="w-1/2 p-2 sm:w-1/4">
                  <a
                    href="#"
                    className="block border border-blue-300 dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300"
                  >
                    <img
                      src={data.image1}
                      alt=""
                      className="object-cover w-full lg:h-20"
                    />
                  </a>
                </div>
                <div className="w-1/2 p-2 sm:w-1/4">
                  <a
                    href="#"
                    className="block border border-transparent dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300"
                  >
                    <img
                      src={data.image2}
                      alt=""
                      className="object-cover w-full lg:h-20"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 ">
            <div className="lg:pl-20">
              <div className="mb-2">
                <span className="text-lg font-medium text-rose-500 dark:text-rose-200">
                  New
                </span>
                <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold dark:text-white md:text-4xl">
                  {data.name}
                </h2>

                <p className="max-w-md mb-8 text-gray-700 dark:text-white">
                  {data.details}
                </p>
                <p className="inline-block mb-8 text-4xl font-bold text-gray-700 dark:text-white ">
                  <span>ราคา {data.price}.- บาท</span>
                </p>
              </div>
              <div className="flex items-center mb-8">
                <h2 className="w-16 text-xl font-bold dark:text-white">
                  Size:
                </h2>
                <div className="flex flex-wrap -mx-2 -mb-2">
                  <button className="py-1 mb-2 mr-1 border w-11 hover:border-blue-400 dark:border-gray-400 hover:text-blue-600 dark:hover:border-gray-300 dark:text-white">
                    XL
                  </button>
                  <button className="py-1 mb-2 mr-1 border w-11 hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-white">
                    S
                  </button>
                  <button className="py-1 mb-2 mr-1 border w-11 hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-white">
                    M
                  </button>
                  <button className="py-1 mb-2 mr-1 border w-11 hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-white">
                    XS
                  </button>
                </div>
              </div>
              <div className="w-32 mb-8 ">
                <label
                  htmlFor="quantity"
                  className="w-full text-xl font-semibold text-gray-700 dark:text-white"
                >
                  Quantity
                </label>
                <div className="relative flex flex-row w-full h-10 mt-4 bg-transparent rounded-lg">
                  <button className="w-20 h-full text-gray-600 bg-gray-300 rounded-l outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-white hover:text-gray-700 dark:bg-gray-900 hover:bg-gray-400">
                    <span className="m-auto text-2xl font-thin">-</span>
                  </button>
                  <input
                    type="number"
                    className="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-300 outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-900 focus:outline-none text-md hover:text-black"
                    defaultValue={1}
                  />
                  <button className="w-20 h-full text-gray-600 bg-gray-300 rounded-r outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-white dark:bg-gray-900 hover:text-gray-700 hover:bg-gray-400">
                    <span className="m-auto text-2xl font-thin">+</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center -mx-4 ">
                <div className="w-full px-4 mb-4 lg:w-1/2 lg:mb-0">
                  <button className="flex items-center justify-center w-full p-4 text-blue-500 border border-blue-500 rounded-md dark:text-gray-200 dark:border-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-gray-100 dark:bg-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-700 dark:hover:text-gray-300">
                    Add to Cart
                  </button>
                </div>
                <div className="w-full px-4 mb-4 lg:mb-0 lg:w-1/2">
                  <button className="flex items-center justify-center w-full p-4 text-blue-500 border border-blue-500 rounded-md dark:text-gray-200 dark:border-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-gray-100 dark:bg-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-700 dark:hover:text-gray-300">
                    Add to wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
