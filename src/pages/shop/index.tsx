import React from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import axios from "@/libs/axios";
import { type ProductData } from "@/classes/Product";

type Props = {
  products: ProductData[];
};

const products = [
  {
    id: 1,
    name: "เสื้องานสานสัมพันธ์ ครั้งที่ 16",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    price: "฿ 330.-",
    details: "Size : S, M, L, XL, 2XL, 3XL",
  },
  // More products...
];

export default function ShopPage({ products }: Props) {
  return (
    <HomeLayout titile="การจองสินค้าในงานสานสัมพันธ์ ครั้งที่ 16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
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
    <div className="group relative bg-white rounded-lg">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none  lg:h-80">
        <img
          src={`${product.image1}`}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-125 lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between p-2">
        <div>
          <h3 className="text-lg md:text-sm text-black">
            <Link href={`/shop/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500 overflow-hidden">{product.details}</p>
        </div>
        <p className="text-lg md:text-sm font-medium text-gray-900">
          {product.price}
        </p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await axios.get(`/product`);
  const product = await res.data;

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=59"
  );

  //   console.log(context);

  return {
    props: { products: product.data },
  };
};
