import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import HomeLayout from "@/components/layouts/HomeLayout";
import { type TableData } from "@/classes/Table";
import axios, { fetcher } from "@/libs/axios";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import Link from 'next/link';

const TableLayout = dynamic(() => import("@/components/TableLayout"), {
  ssr: false,
  loading: () => <div className="text-center">Loading...</div>,
});

type nickname = {
  id: string;
  nickname: string;
  generation: number;
  created_at: string;
  status: string;
  tableId: string;
};

type Props = {
  tables: TableData[];
  nickname: nickname[];
};

export default function Booking({}: Props) {
  const { data: tables, error, isLoading } = useSWR("/tables", fetcher);

  return (
    <HomeLayout title="จองโต๊ะอาหาร">
      <div className="w-full justify-center flex">
        <div
          className="bg-white lg:w-3/5 w-full border-t border-b border-blue-500 text-blue-700 px-4 py-3 rounded-md shadow-md"
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
                ➡️ โต๊ะจะแบ่งเป็น 5 แถว แถวละ 8 โต๊ะ แถวสุดท้าย 4 โต๊ะ รวมทั้งสิ้น 36 โต๊ะ
              </p>
              <p className="text-sm">
                ➡️ <b>การเหมาโต๊ะ</b> จะเป็นการซื้อบัตรจองโต๊ะนั้น ๆ
                หนึ่งโต๊ะสามารถนั่งได้ 8 คน ราคา
                <b className="text-red-700"> 4,000.- </b>บาท / โต๊ะ
              </p>
              <p className="text-sm">
                ➡️ <b>โต๊ะรวม</b> จะเป็นนั่งรวมกับผู้อื่น
                สามารถซื้อบัตรรายบุคคลได้ในราคา
                <b className="text-red-700"> 500.- </b>บาท / คน
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full md:w-1/2 mx-auto">
        <details className="collapse collapse-arrow bg-gray-200 text-black mt-5">
          <summary className="collapse-title font-medium">
            รายการอาหารและเครื่องดื่ม
          </summary>
          <div className="collapse-content text-sm">
            <li>ข้าวเกรียบ</li>
            <li>ออเดิร์ฟ 5 อย่าง</li>
            <li>กระเพราะปลาอกไก่ + ไข่นก</li>
            <li>ขาหมู</li>
            <li>ยำสามกรอบ</li>
            <li>ปลาทับทิมนึ่งมะนาว</li>
            <li>ต้มยำรวมมิตร</li>
            <li>ข้าวผัดปู</li>
            <li>เงาะกระป๋อง</li>
            <li>น้ำเปล่า 1.5 ลิตร 1 ขวด</li>
            <li>น้ำอัดลม 2 ขวด</li>
            <li>แอลกอฮอล์ (ยังไม่ระบุ)</li>
            <li>โซดา (ยังไม่ระบุ)</li>
          </div>
        </details>
      </div>
      {isLoading ? (
        <div className="flex flex-col">
          <div className="flex justify-center mt-4 ">
            <div className="w-16 h-16 border-t-2 border-white rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-center text-lg text-white py-2">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      ) : (
        <TableLayout data={tables ?? []} />
      )}
      {/* <Suspense fallback={<div className="text-center">Loading...</div>}>
      </Suspense> */}
    </HomeLayout>
  );
}
