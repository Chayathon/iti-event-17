import React, { useRef, useState } from "react";
import { type ReservationProductData } from "@/classes/ReservationProduct";
import { type ReservationTableData } from "@/classes/ReservationTable";
import { type ReservationProductItemData } from "@/classes/ReservationProductItem";
import { type ProductData } from "@/classes/Product";
import { type TableData } from "@/classes/Table";
import {
  statusOrderColor,
  statusOrder,
  paymentMethod,
} from "@/helpers/statusOrder";
import { StatusPayment } from "@/interfaces/Payment.type";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/th";
import Image from "next/image";
import TagePayment from "@/components/Tage/TagePayment";
import Link from "next/link";
import axios from "@/libs/axios";
import { mutate } from "swr";

interface ReservationTableJoinTableData extends ReservationTableData {
  tableId?: TableData;
}

type CardTableProps = {
  data: ReservationTableJoinTableData;
  callback?: (data: any) => void;
  isProduct?: boolean;
};

export default function CardTable({
  data,
  callback,
  isProduct = false,
}: CardTableProps) {
  const table = data.tableId as TableData;
  const [loading, setLoading] = useState(false);

  function handlePreview(url: string) {}

  function onApprove() {
    // call swal input string
    Swal.fire({
      title: "ยืนยันการชำระเงิน",
      text: "กรุณากรอกหมายเลขอ้างอิงการชำระเงิน",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showLoaderOnConfirm: true,
      preConfirm: async (ref) => {
        if (!ref) {
          Swal.showValidationMessage(`กรุณากรอกหมายเลขอ้างอิงการชำระเงิน`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })
      .then((result) => {
        if (result.isConfirmed) {
          const refId = result.value;

          Swal.fire({
            title: "กำลังบันทึกข้อมูล",
            didOpen: () => {
              Swal.showLoading();
            },

            allowOutsideClick: () => !Swal.isLoading(),
          });

          axios
            .patch(`/admin/reservation`, {
              id: data.id,
              refId,
              status: "COMPLETE" as StatusPayment,
              tableId: data.tableId.id,
            })
            .then((res) => {
              mutate(
                `/admin/reservation/check?type=${data.type}&id=${data.id}`
              );
              Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ",
                showConfirmButton: false,
                timer: 1500,
              });
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: "บันทึกข้อมูลไม่สำเร็จ",
                showConfirmButton: false,
                timer: 1500,
              });
            });
        }
      })
      .catch((err) => {
        !Swal.isLoading();
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        !Swal.isLoading();
      });
  }

  function onCancel() {}

  if (!isProduct) {
    return (
      <div className="flow-root rounded-lg border bg-white border-blue-500-100 py-3 shadow-sm">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">รหัสการจอง</dt>
            <dd className="text-gray-700 sm:col-span-2">{data.id}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">โต๊ะที่จอง</dt>
            <dd className="text-gray-700 sm:col-span-2">
              ({table.index}) {table.name} <b>(ราคา 4,500.- บาท)</b>
            </dd>
          </div>
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
            <dd className="text-gray-700 sm:col-span-2">{data.phone}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">อีเมล</dt>
            <dd className="text-gray-700 sm:col-span-2">{data.email}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">วิธีการชำระ</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {paymentMethod(data.method)}
              <span className="ml-5  text-blue-500">
                ธนาคารกรุงไทย <b>663-2-44989-1</b> (นางสาวสุภาวดี นพพันธ์)
              </span>
            </dd>
          </div>
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
          {data.refId && (
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">
                หมายเลขอ้างอิงการชำระเงิน
              </dt>
              <dd className="text-gray-700 sm:col-span-2 ">
                <div className="flex flex-col gap-4 w-full md:w-2/5">
                  <b> {data.refId}</b>
                </div>
              </dd>
            </div>
          )}
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
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="btn btn-sm w-full md:w-auto text-white hover:bg-red-700 bg-red-600 border-red-600"
                >
                  <FaBan /> ยกเลิกการชำระเงิน
                </button>
                <span className="text-sm text-center">
                  {" "}
                  (อยู่ในสถานะล้มเหลวการชำระ)
                </span>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    );
  }
}
