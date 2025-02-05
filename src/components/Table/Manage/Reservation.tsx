import React, { useState } from "react";
import { Data } from "@/interfaces/Stat.type";
import { StatusPayment } from "@/interfaces/Payment.type";
import { type ReservationStatus } from "@/interfaces/StatusReservation.type";
import { splitReservationStatus } from "@/libs/spitReservationStatus";
import TageItem from "@/components/Tage/TageItem";
import Link from "next/link";
import moment from "moment";
import "moment/locale/th";
import { Root } from "@/interfaces/StatusReservation.type";

type Props = {
  data: Data;
};

type ReservationType = "all" | "table" | "product";

export default function ReservationTable({ data }: Props) {
  const [status, setStatus] = useState<StatusPayment>("COMPLETE");
  const [type, setType] = useState<ReservationType>("all");

  const reservationData = splitReservationStatus(data);

  // Filter data based on both status and type
  const filteredData = reservationData[status]?.filter((item: ReservationStatus) => {
    if (type === "all") return true;
    return item.type === type;
  });

  return (
    <div>
      <div className="flex justify-between flex-col md:flex-row ">
        <div className="w-full md:w-52 md:my-2 mt-2 flex items-center gap-4">
          <label
            htmlFor="selectStatus"
            className="block text-sm font-medium text-white"
          >
            สถานะ
          </label>

          <select
            name="selectStatus"
            id="selectStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusPayment)}
            className="mt-1.5 w-full rounded-xl border-gray-300 text-gray-700 sm:text-sm"
          >
            <option value="WAIT">รอตรวจสอบ</option>
            <option value="PENDING">รอชำระเงิน</option>
            <option value="COMPLETE">ชำระเงินสำเร็จ</option>
            <option value="FAILS">ชำระเงินไม่สำเร็จ</option>
          </select>
        </div>

        <div className="w-full md:w-52 md:my-2 mb-2 flex items-center gap-2">
          <label
            htmlFor="selectType"
            className="block text-sm font-medium text-white"
          >
            ประเภท
          </label>

          <select
            name="selectType"
            id="selectType"
            value={type}
            onChange={(e) => setType(e.target.value as ReservationType)}
            className="mt-1.5 w-full rounded-xl border-gray-300 text-gray-700 sm:text-sm"
          >
            <option value="all">ทั้งหมด</option>
            <option value="table">จองโต๊ะ</option>
            <option value="product">จอง/ซื้อสินค้า</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table bg-white rounded-2xl">
          <thead>
            <tr className="text-black text-center">
              <th>ชื่อ-นามสกุล</th>
              <th className="hidden md:table-cell">ข้อมูลติดต่อ</th>
              <th>ประเภทรายการ</th>
              <th className="hidden lg:table-cell">สถานะสินค้า</th>
              <th className="hidden lg:table-cell">เมื่อ</th>
              <th>ตรวจสอบรายการชำระเงิน</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item: ReservationStatus) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="text-black">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-sm opacity-50">
                        {" "}
                        (รุ่น {item.generation}) {item.nickname}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell">
                  <a
                    className="text-black font-bold"
                    href={`tel:${item.phone}`}
                  >
                    {item.phone}
                  </a>
                  <br />
                  <a className="text-black" href={`mailto:${item.email}`}>
                    {item.email}
                  </a>
                </td>
                <td>
                  {
                    <Link
                      href={`/manage/reservation/view/${item.type}/${item.id}`}
                      className={`${
                        item.type === "table"
                          ? "text-green-600"
                          : "text-blue-600"
                      } font-bold`}
                    >
                      {item.type === "table" ? "จองโต๊ะ" : "จอง/ซื้อสินค้า"}
                    </Link>
                  }
                  <br />
                  <span className="badge badge-outline badge-info badge-sm">
                    {item.method}
                  </span>
                </td>
                <td className="text-black text-center hidden lg:table-cell">
                  {item.type === "product" && (
                    <TageItem status={item.item_status} />
                  )}
                  {item.type === "table" && (
                    "-"
                  )}
                </td>
                <td className="text-black text-center hidden lg:table-cell">
                  {moment(item.created_at).format("lll น.")}
                </td>
                <td>
                  <Link
                    href={`/manage/reservation/approved/${item.type}/${item.id}`}
                    className="btn btn-sm btn-block btn-primary text-white"
                  >
                    ตรวจสอบ
                  </Link>
                </td>
                <th></th>
              </tr>
            ))}
          </tbody>
          {/* foot */}
          {/* <tfoot>
            <tr className="text-black">
              <th>ชื่อ-นามสกุล</th>
              <th className="hidden md:block">ข้อมูลติดต่อ</th>
              <th>ประเภทรายการ</th>
              <th className="hidden md:block">เมื่อ</th>
              <th>ตรวจสอบรายการชำระเงิน</th>
              <th>ตัวเลือก</th>
              <th></th>
            </tr>
          </tfoot> */}
        </table>
      </div>
    </div>
  );
}