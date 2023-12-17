import React from "react";
import HomeLayout from '@/components/layouts/HomeLayout';

type Props = {};

export default function Booking({}: Props) {

  return (
    <HomeLayout>
      <div className="flex mt-14 justify-center">
        <h1 className="text-4xl font-bold text-white">จองโต๊ะอาหาร</h1>
      </div>
      {/* {JSON.stringify(tables)} */}
      <div className="w-full justify-center flex">
        <div
          className="bg-white lg:w-2/4 w-full border-t mt-4 border-b border-blue-500 text-blue-700 px-4 py-3 rounded-md shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 hidden md:block">
              {/* You can replace the content of this div with an icon or an SVG image */}
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
                ➡️ โต๊ะจะแบ่งเป็น 6 แถว แถวละ 8 โต๊ะ รวมทั้งสิ้น 48 โต๊ะ
              </p>
              <p className="text-sm">
                ➡️ <b>การเหมาโต๊ะ</b> จะเป็นการซื้อบัตรจองโต๊ะนั้น ๆ
                โต๊ะสามารถนั้งได้ 8 คน ราคา
                <b className="text-red-700"> 2,800.- </b>บาท / โต๊ะ
              </p>
              <p className="text-sm">
                ➡️ <b>โต๊ะรวม</b> จะเป็นนั่งรวมกับผู้อื่น
                สามารถซื้อบัตรรายบุคคลได้ในราคา
                <b className="text-red-700"> 380.- </b>บาท / คน {" "}
                <b>สามารถซื้อบัตรรายบุคคล หน้างานครับ</b>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <TableLayout data={tables ?? []} /> */}
    </HomeLayout>
  );
}
