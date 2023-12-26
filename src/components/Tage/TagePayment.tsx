import React from "react";
import { StatusPayment } from "@/interfaces/Payment.type";

type Props = {
  status: StatusPayment;
};

export default function PaymentStatus({ status }: Props) {
  switch (status) {
    case "PENDING":
      return (
        <span className="px-2 inline-flex text-sm  leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          รอชำระเงิน
        </span>
      );
    case "WAIT":
      return (
        <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          รอการตรวจสอบ
        </span>
      );
    case "COMPLETE":
      return (
        <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-500 text-white">
          ชำระเงินเรียบร้อย
        </span>
      );
    case "FAILS":
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          ชำระเงินไม่สำเร็จ
        </span>
      );
  }
}
