import React, { useState } from "react";
import { type TableData, TableWithReservation } from "@/classes/Table";
import Swal from "sweetalert2";
import PaidModal from "@/components/Modals/PaidModal";

type nickname = {
  id: string;
  nickname: string;
  generation: number;
  created_at: string;
  status: string;
  tableId: string;
};

type Props = {
  data: TableWithReservation[];
  admin?: boolean;
};

export default function TableLayout({ data, admin }: Props) {
  const [Selected, setSelected] = useState<TableWithReservation>(null);
  let thisTable = null;

  function getTableStatus(table: TableWithReservation) {
    thisTable = table.reservation[0];

    if (thisTable?.status === "PENDING" || thisTable?.status === "WAIT") {
      return "bg-yellow-500 text-white cursor-pointer hover:scale-110 transition";
    }

    if (!table.isAvailable) {
      return "bg-blue-800 text-white cursor-not-allowed pointer-events-none";
    }

    if (table.isReserved && thisTable?.status === "COMPLETE") {
      return "bg-blue-500 text-white cursor-pointer hover:scale-110 transition";
    }

    return "bg-green-500 text-white cursor-pointer hover:scale-110 transition";
  }

  async function onClick(table: TableWithReservation) {
    if (admin) {
      console.log("admin Mode");
      return;
    }

    if ((table.isReserved && !table.isRetail) || !table.isAvailable) {
      // const thisTable = nickname?.find((item) => item.tableId === table.id);
      const thisTable = table.reservation[0];

      Swal.fire({
        title: "โต๊ะนี้ถูกจองแล้ว",
        html: `<b class="font-xl">${thisTable?.nickname} รุ่นที่ ${thisTable?.generation}</b>
          <br />
        `,
        icon: "info",
        timer: 3000,
      });

      return;
    }

    Swal.fire({
      //หมดเขตการจอง
      title: "ขออภัย",
      html: `<b class="font-xl">ขณะนี้ ระบบปิดรับการจองแล้ว</b>`,
      icon: "error",
      timer: 3000,
    });

    // const modalElement = document.getElementById(
    //   "reservationModal"
    // ) as HTMLDialogElement | null;
    // if (modalElement) {
    //   setSelected(table);
    //   modalElement.showModal();
    // }
  }

  if (!data) return <div>loading...</div>;

  return (
    <React.Fragment>
      <PaidModal selected={Selected} />
      <div className="p-0 md:p-10">
        {!admin && (
          <div>
            <div className="text-center sm:mt-1 mt-4">
              <b className="text-xl md:text-3xl text-amber-400 w-full">
                🔔 กรุณาชำระเงินภายใน 3 วัน หลังจากการจองโต๊ะ
              </b>
              <br />
              <span
                title="มีการโทรแจ้งให้ทราบ 1 ครั้ง"
                className="text-xl text-white mt-4"
              >
              <b className="text-lg md:text-xl lg:text-2xl">
                ⛔ ระบบปิดรับการจองแล้ว ⛔
              </b>
              </span>
            </div>
            <div className="w-full text-center bg-slate-600 rounded-2xl my-5">
              <h1 className="text-white text-xl p-5">👯‍♂️ 👯‍♂️ &emsp; STAGE &emsp; 👯‍♂️ 👯‍♂️</h1>
            </div>
            <div className="mb-2 flex gap-2">
              <div className="badge badge-neutral bg-green-500 p-2 text-white">
                ว่าง
              </div>
              <div className="badge badge-neutral bg-yellow-500 p-2 text-white">
                รอชำระเงิน
              </div>
              <div className="badge badge-neutral bg-blue-500 p-2 text-white">
                จองแล้ว
              </div>
              <div className="badge badge-neutral p-2 bg-blue-800 text-white">
                อาจารย์
              </div>
              {/* <div className="badge badge-neutral p-2 bg-neutral text-white">
                ไม่พร้อมให้บริการ
              </div> */}
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 w-full lg:gap-4 gap-2">
          {data?.map((table) => (
            <div
              key={table.id}
              onClick={() => onClick(table)}
              className={`flex-1 p-2 ${getTableStatus(
                table
              )}  rounded-2xl text-black text-center lg:w-full lg:h-20 md:w-20 md:h-20 sm:h-8 sm:w-18`}
            >
              <p className={"text-white text-xs md:text-md lg:text-lg"}>
                {table.name}
              </p>
              <span className="hidden md:block">
                {table.isAvailable && table.isReserved && thisTable?.status === "COMPLETE" && (
                  <b className="text-lg lg:text-2xl md:text-lg text-white">จองแล้ว</b>
                )}
                {table.isAvailable && table.isReserved && (thisTable?.status === "PENDING" || thisTable?.status === "WAIT") && (
                  <b className="text-lg xl:text-lg lg:text-md md:text-sm text-white">รอชำระเงิน</b>
                )}
                {table.isAvailable && !table.isReserved && (
                  <b className="text-lg lg:text-2xl md:text-lg">ว่าง</b>
                )}
                {!table.isAvailable && (
                  <b className="text-lg xl:text-xl lg:text-lg md:text-md">อาจารย์</b>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
