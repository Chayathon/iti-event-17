import Link from "next/link";
import Swal from "sweetalert2";
import axios from "@/libs/axios";
import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import { type Cart } from "@/interfaces/Cart.type";
import { type ProductData } from "@/classes/Product";
import HomeLayout from "@/components/layouts/HomeLayout";
import { FaCartPlus, FaCartShopping } from "react-icons/fa6";
import { type ProductOptionData } from "@/classes/ProductOption";
import { useRouter } from "next/router";
import { FaAngleLeft } from "react-icons/fa";

type Props = {
  productData: ProductData;
};

export default function Product({ productData }: Props) {
  const router = useRouter();

  return (
    <HomeLayout>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-9 md:py-1 lg:max-w-7xl lg:px-8">
        <ProductCard data={productData} />
      </div>
    </HomeLayout>
  );
}

export const ProductCard = ({ data }: { data?: ProductData }) => {
  const router = useRouter();
  const [count, setCount] = useState("0");
  const [setSelectImage, setSetselectImage] = useState(data?.image3);
  const [optionSelect, setOptionSelect] = useState<ProductOptionData>();
  const [quantity, setQuantity] = useState(1);

  // const handleOptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setOptionSelect(e.target.value);
  // };

  function handleImageSelect(image: string) {
    setSetselectImage(image);
  }

  const handleOptionSelect = (item: ProductOptionData) => {
    setQuantity(1);
    setOptionSelect(item);
  };

  const addQuantity = () => {
    setQuantity(quantity + 1);
  };

  const removeQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (optionSelect === undefined) {
      Swal.fire({
        icon: "error",
        title: "แจ้งเตือน",
        text: "กรุณาเลือก ตัวเลือกสินค้า",
      });
      return;
    }

    if (quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "แจ้งเตือน",
        text: "กรุณาเลือกจำนวนสินค้า",
      });
      return;
    }

    let cart = localStorage.getItem("cart");

    const cartPayload: Cart = {
      id: data.id,
      name: data.name,
      price: data.price,
      quantity: quantity,
      optionName: optionSelect.name,
      optionId: optionSelect.id,
      image: data.image1,
    };

    if (cart === null) {
      localStorage.setItem("cart", JSON.stringify([cartPayload]));

      setCount("1");
    } else {
      let cartData = JSON.parse(cart);

      let isExist = cartData.find(
        (item: Cart) => item.id === data.id && item.optionId === optionSelect.id
      );

      if (isExist) {
        let index = cartData.findIndex(
          (item: Cart) =>
            item.id === data.id && item.optionId === optionSelect.id
        );

        cartData[index].quantity += quantity;
      } else {
        cartData.push(cartPayload);

        setCount((parseInt(count) + 1).toString());
      }

      localStorage.setItem("cart", JSON.stringify(cartData));
    }

    Swal.fire({
      icon: "success",
      title: "เพิ่มสินค้าลงตะกร้าสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    let cart = localStorage.getItem("cart");

    if (cart !== null) {
      let cartData = JSON.parse(cart);

      let count = cartData.reduce(
        (sum: number, item: Cart) => sum + item.quantity,
        0
      );

      setCount(count.toString());
    }

    return () => {};
  }, []);

  return (
    <React.Fragment>
      <div className="max-w-6xl px-4 mx-auto lg:py-8 md:px-6">
      <button onClick={handleBack} className="btn btn-outline btn-sm mb-2 hidden sm:flex"><FaAngleLeft/>ย้อนกลับ</button>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 md:w-1/2">
            <div className="sticky top-0 z-50 overflow-hidden ">
              <div className="relative mb-6 lg:mb-10 lg:h-2/4 ">
                <img
                  src={setSelectImage}
                  alt=""
                  className="object-cover w-full lg:h-full "
                />
              </div>
              <div className="flex-wrap flex">
                <div className="w-1/2 p-2 sm:w-1/4">
                  <div
                    onClick={()=>handleImageSelect(data.image1)}
                    className="block border cursor-pointer rounded-xl bordlg-blue-300 dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300"
                  >
                    <img
                      src={data.image1}
                      alt=""
                      className="object-cover w-full rounded-lg lg:h-28 md:h-14 h-24"
                    />
                  </div>
                </div>
                <div className="w-1/2 p-2 sm:w-1/4">
                  <div
                    onClick={()=>handleImageSelect(data.image2)}
                    className="block border cursor-pointer rounded-lg border-transparent dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300"
                  >
                    <img
                      src={data.image2}
                      alt=""
                      className="object-cover w-full rounded-lg lg:h-28 md:h-14 h-24"
                    />
                  </div>
                </div>
                <div className="w-1/2 p-2 sm:w-1/4">
                  <div
                    onClick={()=>handleImageSelect(data.image3)}
                    className="block border cursor-pointer rounded-lg border-transparent dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300"
                  >
                    <img
                      src={data.image3}
                      alt=""
                      className="object-cover w-full rounded-lg lg:h-28 md:h-14 h-24"
                    />
                  </div>
                </div>
                <div className="w-1/2 p-2 sm:w-1/4">
                  <div
                    onClick={()=>handleImageSelect(data.image4)}
                    className="block border cursor-pointer rounded-lg border-transparent dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300"
                  >
                    <img
                      src={data.image4}
                      alt=""
                      className="object-cover w-full rounded-lg lg:h-28 md:h-14 h-24"
                    />
                  </div>
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
                <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold  text-white md:text-4xl">
                  {data.name}
                </h2>

                <p className="max-w-md mb-8  text-white">{data.details}</p>
                <p className="inline-block mb-8 text-4xl font-bold  text-white ">
                  <span>{data.price} .-</span>
                </p>
              </div>
              <div className="flex items-center mb-8">
                <h2 className="w-20 text-xl font-bold  text-white">ตัวเลือก:</h2>
              </div>
              <div className="flex flex-wrap ml-6">
                <fieldset>
                  <legend className="sr-only">ตัวเลือก</legend>
                </fieldset>
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                {data.productOption
                  .sort(
                    (a: ProductOptionData, b: ProductOptionData) =>
                      a.index - b.index
                  )
                  .map((item) => (
                    <div key={`${item.name}-${item.id}`}>
                      <input
                        type="radio"
                        name="productOption"
                        value={item.name}
                        id={item.id}
                        onChange={() => handleOptionSelect(item)}
                        className="peer hidden"
                      />

                      <label
                        htmlFor={item.id}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-900 hover:border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white"
                      >
                        <p className="text-sm font-medium">{item.name}</p>
                      </label>
                    </div>
                  ))}
              </div>
              <div className="w-32 mb-8 ">
                <label
                  htmlFor="quantity"
                  className="w-full text-xl font-semibold  text-white"
                >
                  จำนวน
                </label>
                <div className="relative flex flex-row w-full h-10 mt-4 bg-transparent rounded-lg">
                  <button
                    onClick={removeQuantity}
                    className="w-20 h-full rounded-l outline-none cursor-pointer bg-white"
                  >
                    <span className="m-auto text-2xl font-thin text-black">
                      -
                    </span>
                  </button>
                  <input
                    type="number"
                    className="flex items-center w-full font-semibold text-center text-black placeholder-black bg-gray-300 outline-none  [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                    value={quantity}
                    readOnly
                  />
                  <button
                    onClick={addQuantity}
                    className="w-20 h-full rounded-r outline-none cursor-pointer bg-white"
                  >
                    <span className="m-auto text-2xl font-thin text-black">
                      +
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap flex-row items-center gap-4">
                <div>
                  <button
                    onClick={handleAddToCart}
                    className="btn flex items-center justify-center w-fit text-white border border-blue-500 bg-blue-600  hover:border-blue-800 hover:bg-blue-800 rounded-xl"
                  >
                    <FaCartPlus className="w-5 h-5" />
                    {/* <span className="ml-2">(ไม่รับการจองเพิ่มแล้ว Sold Out)</span> */}
                  </button>
                </div>
                <div>
                  <Link
                    href={"/cart"}
                    className="btn flex items-center justify-center w-fit text-white border border-blue-500  hover:bg-blue-600 hover:border-blue-800 rounded-xl"
                  >
                    <FaCartShopping />
                    <span className="ml-2">ดูตะกร้าสินค้า</span>
                    <div className="badge bg-white ml-2 text-black">
                      {count}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

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

  return {
    props: { productData: filtered },
  };
};
