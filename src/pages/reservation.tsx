import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import HomeLayout from "@/components/layouts/HomeLayout";
import { type TableData } from "@/classes/Table";
import axios, { fetcher } from "@/libs/axios";
import useSWR from "swr";
import { GetServerSideProps } from "next";

const TableLayout = dynamic(() => import("@/components/TableLayout"), {
  ssr: false,
  loading: () => <div className="text-center">Loading...</div>,
});

type Props = {
  tables: TableData[];
};

export default function Booking({ tables }: Props) {
  return (
    <HomeLayout>
      <div className="flex mt-14 justify-center">
        <h1 className="text-4xl font-bold text-white">จองโต๊ะอาหาร</h1>
      </div>
      <div className="w-full justify-center flex">
        <div
          className="bg-white lg:w-2/4 w-full border-t mt-4 border-b border-blue-500 text-blue-700 px-4 py-3 rounded-md shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 hidden md:block">
              <svg
                className="w-full h-full text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 1C4.48 1 0 5.48 0 11s4.48 10 10 10 10-4.48 10-10S15.52 1 10 1zm1 15h-2v-2h2v2zm0-4h-2V6h2v6z"></path>
              </svg>
            </div>
            <div>
              <p className="font-bold">โปรดทราบ</p>
              <p className="text-sm">
                ➡️ โต๊ะจะแบ่งเป็น 5 แถว แถวละ 8 โต๊ะ รวมทั้งสิ้น 40 โต๊ะ
              </p>
              <p className="text-sm">
                ➡️ <b>การเหมาโต๊ะ</b> จะเป็นการซื้อบัตรจองโต๊ะนั้น ๆ
                โต๊ะสามารถนั้งได้ 8 คน ราคา
                <b className="text-red-700"> 4,500.- </b>บาท / โต๊ะ
              </p>
              <p className="text-sm">
                {/* ➡️ <b>โต๊ะรวม</b> จะเป็นนั่งรวมกับผู้อื่น
                สามารถซื้อบัตรรายบุคคลได้ในราคา
                <b className="text-red-700"> 570.- </b>บาท / คน{" "}
                <b>สามารถซื้อบัตรรายบุคคล หน้างานครับ</b> */}
                ➡️ <b>โต๊ะรวม</b> <span className="text-red-700">ทางเราจะแจ้งให้ทราบภายหลัง</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="w-12 h-12 border-t-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
      )} */}
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <TableLayout data={tables ?? []} />
      </Suspense>
    </HomeLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const BASE_URL = process.env.BASE_URL || "http://localhost:3000/api";

  const res = await axios.get(`/tables`);
  const tables = await res.data;

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=59"
  );

  return {
    props: { tables: tables.data },
  };
};
