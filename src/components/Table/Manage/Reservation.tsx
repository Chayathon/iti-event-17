import React, { useState } from "react";
import { Data } from "@/interfaces/Stat.type";
import { StatusPayment } from "@/interfaces/Payment.type";
import { type ReservationTableData } from "@/classes/ReservationTable";
import Link from "next/link";
import moment from "moment";
import "moment/locale/th";

type Props = {
  data: Data;
};

interface newReservationTableData extends ReservationTableData {
  type: string;
}

export default function ReservationTable({ data }: Props) {
  const [Status, setStatus] = useState<StatusPayment>("WAIT");

  if (!data) return <div>loading...</div>;

  return (
    <div>
      {/* {JSON.stringify(data[Status])} */}
      <div className="w-full md:w-52 my-2 flex items-center gap-4">
        <label
          htmlFor="selectStatus"
          className="block text-sm font-medium text-white"
        >
          สถานะ
        </label>

        <select
          name="selectStatus"
          id="selectStatus"
          defaultValue={Status}
          onChange={(e) => setStatus(e.target.value as StatusPayment)}
          className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
        >
          <option value="WAIT">รอตรวจสอบ</option>
          <option value="PENDING">รอชำระเงิน</option>
          <option value="SUCCESS">ชำระเงินสำเร็จ</option>
          <option value="FAILED">ชำระเงินไม่สำเร็จ</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table bg-white rounded-md">
          <thead>
            <tr className="text-black text-center">
              <th>ชื่อ-นามสกุล</th>
              <th className="hidden md:block">ข้อมูลติดต่อ</th>
              <th>ประเภทรายการ</th>
              <th className="hidden md:block">เมื่อ</th>
              <th>ตรวจสอบรายการชำระเงิน</th>
              <th>ตัวเลือก</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data[Status]?.map((item: newReservationTableData) => (
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
                <td className="hidden md:block">
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
                      href={`/manage/reservation/${item.id}`}
                      className={`        ${
                        item.type === "TABLE"
                          ? "text-green-600"
                          : "text-blue-600"
                      } font-bold`}
                    >
                      {item.type === "TABLE" ? "จองโต๊ะ" : "จอง/ซื้อสินค้า"}
                    </Link>
                  }
                  <br />
                  <span className="badge badge-outline badge-info badge-sm">
                    {item.method}
                  </span>
                </td>
                <td className="text-black text-center hidden md:block">
                  {moment(item.created_at).format("lll น.")}
                </td>
                <td>
                  <Link
                    href={`/manage/reservation/${item.id}`}
                    className="btn btn-sm btn-block btn-primary text-white"
                  >
                    ตรวจสอบ
                  </Link>
                </td>
                <td>...</td>
                <th></th>
              </tr>
            ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
