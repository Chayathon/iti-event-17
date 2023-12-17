import React from "react";
import dynamic from "next/dynamic";
import { FaUtensils, FaShirt } from "react-icons/fa6";
import HomeLayout from "@/components/layouts/HomeLayout";

const TypingEffect = dynamic(() => import("@/components/TypingEffect"), {
  ssr: false,
});

export default function Home() {
  return (
    <HomeLayout>
      <section className="mt-36">
        <div className="float-none mx-auto px-4 lg:flex  lg:items-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="sm:text-5xl text-3xl ">
              🎈
              <span className="from-green-300 mx-2 via-blue-500 to-purple-600 bg-gradient-to-r  bg-clip-text font-extrabold text-transparent ">
                งานสานสัมพันธ์
              </span>
              🎈
            </h1>
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text font-bold whitespace-nowrap text-transparent md:text-4xl sm:text-2xl text-xl">
              <TypingEffect text={["Information Technology Industrial"]} />
            </h1>
            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
              illo tenetur fuga ducimus numquam ea!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="inline-block  w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                href="/reservation"
              >
                <span className="inline-flex gap-2">
                  <FaUtensils />
                  จองโต๊ะอาหาร
                </span>
              </a>

              <a
                className="inline-block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="/about"
              >
                <span className="inline-flex gap-2">
                  <FaShirt />
                  สั่งซื้อเสื้อ
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
