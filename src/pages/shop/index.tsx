import React, { useEffect, useState } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import axios, { fetcher } from "@/libs/axios";
import { type ProductData } from "@/classes/Product";
import useSWR from "swr";
import { FaCartShopping } from "react-icons/fa6";

type Props = {
  products: ProductData[];
};

export default function ShopPage({}: Props) {
  // const { data: products, error } = useSWR(`/api/product`, fetcher);
  const [products, setProducts] = useState([]);
  const [loading, setloading] = useState(false);
  const [count, setCount] = useState("0");
  
  useEffect(() => {
    const cartItem = localStorage.getItem("cart")
    const cart = cartItem ? JSON.parse(cartItem) : [];
    setCount(cart.length || 0);
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setloading(true);
      const res = await axios.get(`/product`);
      const product = await res.data;
      setProducts(product.data);
      setloading(false);
      // .......
    };
    fetchProducts();
  }, []);

  return (
    <HomeLayout title="สั่งซื้อสินค้า">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-end pointer-events-none">
          <Link
            href={"/cart"}
            className="btn btn-sm md:btn-md flex items-center justify-center w-fit text-white border border-blue-500  hover:bg-blue-600 hover:border-blue-800 rounded-xl"
          >
            <FaCartShopping />
            <span className="ml-2 text-xs md:text-lg">ดูตะกร้าสินค้า</span>
            <div className="badge bg-white ml-2 text-black">
              {count}
            </div>
          </Link>
        </div>
        
        <p className="pt-4 text-center text-lg md:text-2xl lg:text-3xl ">⛔ ขออภัย ขณะนี้ปิดรับคำสั่งซื้อแล้ว ⛔</p>

        {loading && (
          // title loading
          <div className="flex flex-col">
            <div className="flex justify-center mt-4 ">
              <div className="w-16 h-16 border-t-2 border-white rounded-full animate-spin"></div>
            </div>
            <div>
              <p className="text-center text-lg text-white py-2">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        )}
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 pointer-events-none opacity-50">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export function ProductCard({ product }: { product: ProductData }) {
  return (
    <div className="group relative bg-white rounded-xl">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-xl bg-gray-200 lg:aspect-none lg:h-80">
        <img
          src={`${product.image1}`}
          alt={product.name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center group-hover:scale-125 transition lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between p-2">
        <div>
          <p className="text-lg font-bold text-black">
            <Link href={`/shop/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </p>
          <p className="mt-1 text-sm text-gray-500 overflow-hidden">
            {product.details}
          </p>
        </div>
        <p className="text-lg font-medium text-gray-900">
          {product.price} .-
        </p>
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   console.log(process.env.BASE_URL);
//   // const res = await axios.get(`/api/product`);
//   // const product = await res.data;

//   const res = await fetch(`${process.env.BASE_URL}/api/product`);
//   const product = await res.json();

//   console.log(product.data);

//   context.res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=300, stale-while-revalidate=59"
//   );

//   //   console.log(context);

//   return {
//     props: { products: [] },
//   };
// };
