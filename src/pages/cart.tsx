import React, { useEffect, useState } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import { type Cart } from "@/interfaces/Cart.type";
import Image from "next/image";

type Props = {};

export default function CartPage({}: Props) {
  const [Cart, setCart] = useState<Cart[]>([]);

  function increaseQuantity(item: Cart) {
    const newCart = [...Cart];
    const foundIndex = newCart.findIndex(
      (x) => x.id === item.id && x.optionSelect === item.optionSelect
    );
    newCart[foundIndex].quantity++;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function decreaseQuantity(item: Cart) {
    const newCart = [...Cart];
    const foundIndex = newCart.findIndex(
      (x) => x.id === item.id && x.optionSelect === item.optionSelect
    );
    if (newCart[foundIndex].quantity > 1) {
      newCart[foundIndex].quantity--;
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      removeItem(item);
    }
  }

  function removeItem(item: Cart) {
    const newCart = [...Cart];
    const foundIndex = newCart.findIndex(
      (x) => x.id === item.id && x.optionSelect === item.optionSelect
    );
    newCart.splice(foundIndex, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function getCart() {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCart(JSON.parse(cart));
    }

    return [];
  }

  useEffect(() => {
    getCart();
  }, [Cart]);

  return (
    <HomeLayout titile="🛒 ตะกร้าสินค้า">
      <div>
        <section className="flex items-center ">
          <div className="justify-center flex-1 px-4 py-6 mx-auto max-w-7xl lg:py-4 md:px-6">
            <div className="p-8 bg-gray-700">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full px-4 mb-8 xl:w-8/12 xl:mb-0">
                  <div className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
                    <div className="w-full md:block hidden px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                      <h2 className="font-bold text-white text-xl">
                        ชื่อสินค้า
                      </h2>
                    </div>
                    <div className="hidden px-4 lg:block lg:w-2/12">
                      <h2 className="font-bold text-white text-xl">ราคา</h2>
                    </div>
                    <div className="hidden md:block px-4 md:w-1/6 lg:w-2/12 ">
                      <h2 className="font-bold text-white text-xl">จำนวน</h2>
                    </div>
                    <div className="hidden md:block px-4 text-right md:w-1/6 lg:w-2/12 ">
                      <h2 className="font-bold text-white text-xl"> ราคารวม</h2>
                    </div>
                  </div>
                  <div className="py-4 mb-8 border-t border-b border-gray-200 dark:border-gray-700">
                    {Cart.map((item, index) => (
                      <div
                        key={`item-${item.id}-${index}`}
                        className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8"
                      >
                        <div className="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                          <div className="flex flex-wrap items-center -mx-4">
                            <div className="w-full px-4 mb-3 md:w-1/3">
                              <div className="w-full h-96 md:h-24 md:w-24">
                                <Image
                                  src={item.image}
                                  width={300}
                                  height={300}
                                  alt="Picture of item cart"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </div>
                            <div className="w-2/3 px-4">
                              <h2 className="mb-2 text-xl font-bold text-white">
                                {item.name}
                              </h2>
                              <p className="text-white  ">
                                Option: {item.optionSelect}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="hidden px-4 lg:block lg:w-2/12">
                          <p className="text-lg font-bold text-white ">
                            {item.price}.- บาท
                          </p>
                        </div>
                        <div className="w-auto px-4 md:w-1/6 lg:w-2/12 ">
                          <div className="inline-flex items-center px-4 font-semibold text-white border border-gray-200 rounded-md dark:border-gray-700 ">
                            <button
                              onClick={() => decreaseQuantity(item)}
                              className="py-2 "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={32}
                                height={32}
                                fill="currentColor"
                                className="bi bi-dash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                              </svg>
                            </button>
                            <input
                              type="number"
                              readOnly
                              className="w-12 px-2 py-4 text-xl text-black text-center border-0 rounded-md bg-gray-50  md:text-right  [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                              placeholder={item.quantity.toString()}
                            />
                            <button
                              onClick={() => increaseQuantity(item)}
                              className="py-2 text-white"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={32}
                                height={32}
                                fill="currentColor"
                                className="bi bi-plus"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="w-auto px-4 text-right md:w-1/6 lg:w-2/12 ">
                          <p className="text-lg font-bold text-amber-400 ">
                            {item.price * item.quantity}.- บาท
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full px-4 xl:w-4/12">
                  <div className="p-6 border border-blue-100 dark:bg-gray-900 dark:border-gray-900 bg-blue-50 md:p-8">
                    <h2 className="mb-8 text-3xl font-bold text-gray-700 ">
                      Order Summary
                    </h2>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300 dark:border-gray-700 ">
                      <span className="text-gray-700 ">Subtotal</span>
                      <span className="text-xl font-bold text-gray-700  ">
                        $99
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 mb-4 ">
                      <span className="text-gray-700  ">Shipping</span>
                      <span className="text-xl font-bold text-gray-700  ">
                        Free
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 mb-4 ">
                      <span className="text-gray-700 ">Order Total</span>
                      <span className="text-xl font-bold text-gray-700 ">
                        $99.00
                      </span>
                    </div>
                    <h2 className="text-lg text-white ">We offer:</h2>
                    <div className="flex items-center mb-4 ">
                      <a href="#">
                        <img
                          src="https://i.postimg.cc/g22HQhX0/70599-visa-curved-icon.png"
                          className="object-cover h-16 mr-2 w-26"
                        />
                      </a>
                      <a href="#">
                        <img
                          src="https://i.postimg.cc/HW38JkkG/38602-mastercard-curved-icon.png"
                          className="object-cover h-16 mr-2 w-26"
                        />
                      </a>
                      <a href="#">
                        <img
                          src="https://i.postimg.cc/HL57j0V3/38605-paypal-straight-icon.png"
                          className="object-cover h-16 mr-2 w-26"
                        />
                      </a>
                    </div>
                    <div className="flex items-center justify-between ">
                      <button className="block w-full py-4 font-bold text-center text-gray-100 uppercase bg-blue-500 rounded-md hover:bg-blue-600">
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
