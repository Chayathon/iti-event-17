import React from "react";
import { StatusItem } from "@/interfaces/Product.type";

type Props = {
  status: StatusItem;
};

export default function PaymentStatus({ status }: Props) {
  switch (status) {
    case "PREPARING":
      return (
        <span className="px-2 inline-flex text-sm  leading-5 font-semibold rounded-full bg-blue-500 text-white">
          กำลังเตรียมสินค้า
        </span>
      );
    case "SHIPPED":
      return (
        <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-500 text-white">
          จัดส่งสินค้าแล้ว
        </span>
      );
    case "PICKUP":
      return (
        <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-teal-500 text-white">
          รับสินค้าหน้างาน
        </span>
      );
  }
}
