import React from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import axios from "@/libs/axios";

type Props = {};

export default function Product({}: Props) {
  const router = useRouter();
  const { product } = router.query;
  return (
    <HomeLayout titile="รายการสินค้า">
      Product <h1>{product}</h1>
    </HomeLayout>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    // const BASE_URL = process.env.BASE_URL || "http://localhost:3000/api";

    const productId = context.query["product.tsx"][0] as string;
  
    //   const res = await axios.get(`/tables`);
    //   const tables = await res.data;
  
    //   context.res.setHeader(
    //     "Cache-Control",
    //     "public, s-maxage=300, stale-while-revalidate=59"
    //   );
  
    return {
      props: { tables: [] },
    };
  };
  