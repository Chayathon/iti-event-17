import React, { useRef, useState } from "react";
import { type ReservationProductData } from "@/classes/ReservationProduct";
import { type ReservationTableData } from "@/classes/ReservationTable";
import { type ReservationProductItemData } from "@/classes/ReservationProductItem";
import { type ProductData } from "@/classes/Product";
import { type TableData, TableWithReservation } from "@/classes/Table";
import {
  statusOrderColor,
  statusOrder,
  paymentMethod,
} from "@/helpers/statusOrder";
import { StatusPayment } from "@/interfaces/Payment.type";
import { FaCheckCircle, FaBan, FaTruck } from "react-icons/fa";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/th";
import Image from "next/image";
import TagePayment from "@/components/Tage/TagePayment";
import TageItem from "@/components/Tage/TageItem";
import Link from "next/link";
import axios from "@/libs/axios";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
import { DeliveryMethod, StatusItem } from "@/interfaces/Product.type";

interface ReservationTableJoinTableData extends ReservationTableData {
  reservationProductItem: ReservationProductData[];
  totalPrice: number;
  item_status?: StatusItem;
  delivery: DeliveryMethod;
  trackingCode?: String;
  tableId?: TableData;
}

type CardTableProps = {
  data: ReservationTableJoinTableData;
  callback?: (data: any) => void;
  isProduct?: boolean;
  readOnly?: boolean;
};

type payload = {
  id: string;
  status: StatusPayment;
  tableId: string;
  type: "table" | "product" | string;
};

type payloadProduct = {
  id: string;
  status: StatusItem;
  trackingCode: string;
  type: "table" | "product" | string;
};

export default function CardTable({
  data,
  callback,
  isProduct = false,
  readOnly,
}: CardTableProps) {
  const table = data.tableId as TableWithReservation;
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onSave(payload: payload) {
    try {
      setLoading(true);
      const resData = await (
        await axios.patch(`/admin/reservation`, payload)
      ).data;

      if (resData) {
        mutate(`/admin/reservation/check?type=${data.type}&id=${data.id}`);
        Swal.fire({
          title: "สำเร็จ",
          text: "ยืนยันการชำระเงินเรียบร้อยแล้ว",
          icon: "success",
          timer: 1500,
        });
      }
      router.back();
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ทำรายการไม่สำเร็จ",
        icon: "error",
      });

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function onSaveProduct(payload: payloadProduct) {
    try {
      setLoading(true);
      const resData = await (
        await axios.patch(`/admin/reservation/product`, payload)
      ).data;

      if (resData) {
        // mutate(`/admin/reservation/check?type=${data.type}&id=${data.id}`);
        Swal.fire({
          title: "สำเร็จ",
          text: "จัดส่งสินค้าเรียบร้อยแล้ว",
          icon: "success",
          timer: 1500,
        });
      }
      router.back();
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ทำรายการไม่สำเร็จ",
        icon: "error",
      });

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function onApprove() {
    Swal.fire({
      title: "ยืนยันการชำระเงิน",
      text: "ตรวจสอบข้อมูลการชำระเงิน ว่าเงินเข้าแล้วใช่หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = {
          id: data.id,
          status: "COMPLETE" as StatusPayment,
          tableId: data.tableId ? data.tableId.id : "",
          tableIndex: table?.index ?? "",
          tableName: table?.name ?? "",
          type: isProduct ? "product" : "table",
        };

        await onSave(payload);
      }
    });
  }

  async function onShipped() {
    Swal.fire({
      title: "จัดส่งสินค้าแล้ว",
      text: "กรุณากรอกหมายพัสดุ",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showLoaderOnConfirm: true,
      preConfirm: async (trackingCode) => {
        if (!trackingCode) {
          Swal.showValidationMessage(`กรุณากรอกหมายพัสดุ`);
        }
        return trackingCode;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const trackingCode = result.value;

        const payloadProduct = {
          id: data.id,
          status: "SHIPPED" as StatusItem,
          trackingCode,
          type: isProduct ? "product" : "table",
        };

        await onSaveProduct(payloadProduct);
      }
    });
  }

  function onCancel() {}

  return (
    <div className="flow-root rounded-lg border bg-white border-blue-500-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">รหัสการจอง</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.id}</dd>
        </div>
        {table && !table.isHidden && !table.isRetail && (
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">โต๊ะที่จอง</dt>
            <dd className="text-gray-700 sm:col-span-2">
              ({table.index}) {table.name} <b>(ราคา 4,000 บาท)</b>
            </dd>
          </div>
        )}
        {table && table.isRetail && (
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">โต๊ะที่จอง</dt>
            <dd className="text-gray-700 sm:col-span-2">
              ({table.index}) {table.name} <b>(ราคา 500 บาท)</b>
            </dd>
        </div>
        )}

        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">เมื่อวันที่</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {moment(data.created_at).format("lll น.")}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">สถานะการจอง</dt>
          <dd className="text-gray-700 sm:col-span-2">
            <TagePayment status={data.status} />
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ชื่อ-นามสกุล</dt>
          <dd className="text-gray-700 sm:col-span-2">
            ({data.nickname}) {data.name}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">เบอร์โทรศัพท์</dt>
          <dd className="text-gray-700 sm:col-span-2">
            <a className="text-black" href={`tel:${data.phone}`}>
              {data.phone}
            </a>
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">อีเมล</dt>
          <dd className="text-gray-700 sm:col-span-2">
            <a className="text-black" href={`mailto:${data.email}`}>
              {data.email}
            </a>
          </dd>
        </div>
        {isProduct && (
          <>
            {data.address && (
              <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">ที่อยู่</dt>
                <dd className="text-gray-700 sm:col-span-2">{data.address}</dd>
              </div>
            )}
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">รายการสินค้า</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {data?.reservationProductItem?.map((item, index) => (
                  <div className="flex gap-2" key={item.id}>
                    {/* @ts-ignore */}
                    <p className="text-gray-700">{item?.productId?.name}</p>
                    <p className="text-gray-700">
                      {/* @ts-ignore */}
                      {item.optionId.name}
                    </p>
                    <p>x {item.quantity} ชิ้น</p>
                    {/* @ts-ignore */}
                    {(item.optionId.price * item.quantity).toLocaleString()} บาท
                  </div>
                ))}
              </dd>
            </div>
            {(data.delivery !== "PICKUP") && (
              <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">ค่าจัดส่ง</dt>
                <dd className="text-gray-700 sm:col-span-2">50 บาท</dd>
              </div>
            )}
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">ราคาสุทธิ</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {data.totalPrice.toLocaleString()} บาท
              </dd>
            </div>
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">สถานะสินค้า</dt>
              <dd className="text-gray-700 sm:col-span-2">
                <TageItem status={data.item_status} />
              </dd>
            </div>
            {data.trackingCode && (
              <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">หมายเลขพัสดุ</dt>
              <dd className="text-gray-700 sm:col-span-2">
                (Flash Express)&ensp;
                <a
                  href={`https://www.flashexpress.co.th/fle/tracking?se=${data.trackingCode}`}
                  target="_blank"
                >
                  {data.trackingCode}
                </a>
              </dd>
            </div>
            )}
          </>
        )}
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">วิธีการชำระ</dt>
          <dd className="text-gray-700 sm:col-span-2">
            <span className="text-green-500">
              ธนาคารกสิกรไทย <b>199-1-20011-4</b> (นางสาวสุภากมล ลักขษร)
            </span>
          </dd>
        </div>
        {data.slip && (
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">หลักฐานการชำระเงิน</dt>
            <dd className="text-gray-700 sm:col-span-2">
              <Link href={data.slip} target="_blank">
                <Image
                  src={data.slip}
                  alt=""
                  className="rounded-lg object-cover md:w-44  cursor-pointer shadow-xl"
                  width={500}
                  height={500}
                  quality={50}
                  loading="lazy"
                />
              </Link>
            </dd>
          </div>
        )}

        {!readOnly && (
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">ตัวเลือก</dt>
            <dd className="text-gray-700 sm:col-span-2 ">
              <div className="flex flex-col gap-4 w-full md:w-2/5">
                {data.status === "WAIT" && (
                  <button
                    onClick={onApprove}
                    disabled={loading}
                    className="btn btn-sm w-full md:w-auto text-white hover:bg-green-700 bg-green-600 border-green-600"
                  >
                    <FaCheckCircle /> ยืนยันการชำระเงิน
                  </button>
                )}
                {/* <button
                  onClick={onCancel}
                  disabled={loading}
                  className="btn btn-sm w-full md:w-auto text-white hover:bg-red-700 bg-red-600 border-red-600"
                >
                  <FaBan /> ยกเลิกการชำระเงิน
                </button>
                <span className="text-sm text-center">
                  (อยู่ในสถานะล้มเหลวการชำระ)
                </span> */}
                {(isProduct && data.item_status === "PREPARING" && data.status === "COMPLETE") && (
                  <button
                    onClick={onShipped}
                    disabled={loading}
                    className="btn btn-sm w-full md:w-auto text-white hover:bg-green-700 bg-green-600 border-green-600"
                  >
                    <FaTruck /> จัดส่งสินค้าแล้ว
                  </button>
                )}
              </div>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
