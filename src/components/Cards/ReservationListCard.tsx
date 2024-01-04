import React, { useRef, useState } from "react";
import { type ReservationProductData } from "@/classes/ReservationProduct";
import { type ReservationTableData } from "@/classes/ReservationTable";
import { type ReservationProductItemData } from "@/classes/ReservationProductItem";
import { type ProductData } from "@/classes/Product";
import {
  statusOrderColor,
  statusOrder,
  paymentMethod,
} from "@/helpers/statusOrder";
import { type TableData } from "@/classes/Table";
import { FaUpload, FaCheckCircle, FaBan } from "react-icons/fa";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/th";
import axios from "@/libs/axios";
import supabase from "@/libs/supabase";
import TagePayment from "@/components/Tage/TagePayment";

type CallbackData = {
  id: string;
  status: string;
};

type CardShirtProps = {
  data: ReservationProductData;
  callback?: (data: CallbackData) => void;
};

interface newReservationTableData extends ReservationTableData {
  reservationProductItem: ReservationProductItemData[];
  productId: ProductData;
  optionId: any;
}

type CardTableProps = {
  data: newReservationTableData;
  callback?: (data: CallbackData) => void;
  isProduct?: boolean;
};

export default function CardTable({
  data,
  callback,
  isProduct,
}: CardTableProps) {
  const [Selectedfile, setSelectedfile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  const table = data.tableId as TableData;

  const [loading, setLoading] = useState(false);

  function onClick() {
    fileInput.current?.click();
  }

  function onCancel() {
    setPreview(undefined);
    setSelectedfile(undefined);
    //clear file input
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }

  async function onUpload() {
    try {
      if (!setSelectedfile) {
        throw new Error("กรุณาเลือกไฟล์");
      }

      setLoading(true);

      await supabase.storage
        .from("iti-event")
        .upload(`slip/${data.id}`, Selectedfile);

      // //get url file
      const { data: publicURL } = supabase.storage
        .from("iti-event")
        .getPublicUrl(`slip/${data.id}`);

      const payload = {
        id: data.id,
        slip: publicURL.publicUrl,
        status: "WAIT",
      };

      if (isProduct) {
        await (
          await axios.patch("/reservation/product/upload", payload)
        ).data;
      } else {
        await (
          await axios.patch("/reservation/upload", payload)
        ).data;
      }

      Swal.fire({
        icon: "success",
        title: "อัพโหลดสำเร็จ",
        html: "รอการตรวจสอบการชำระเงิน <br />โดยใช้เวลา 1 - 2 วัน หลังจากนั้นจะมีการแจ้งเตือนผ่านทางอีเมล<br />หรือหน้าตรวจสอบดำเนินการ",
        showConfirmButton: true,
        timer: 10000,
      });

      if (callback) {
        callback({ id: data.id, status: "WAIT" });
      }

      setPreview(undefined);
      setSelectedfile(undefined);
      //clear file input
      if (fileInput.current) {
        fileInput.current.value = "";
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "อัพโหลดไม่สำเร็จ",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(undefined);
      return;
    }

    //sweert preview image
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    setSelectedfile(file);
  }

  if (!isProduct) {
    return (
      <div className="flow-root rounded-lg border bg-white border-blue-500-100 py-3 shadow-sm">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">รหัสการจอง</dt>
            <dd className="text-gray-700 sm:col-span-2">{data.id}</dd>
          </div>
          {table.isHidden && table.isRetail ? (
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">โต๊ะที่จอง</dt>
              <dd className="text-gray-700 sm:col-span-2">
                ({table.index}) {table.name} <b>(ราคา 4,500.- บาท)</b>
              </dd>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">ลักษระการจอง</dt>
              <dd className="text-gray-700 sm:col-span-2">
                รายบุคคล <b>(ราคา 650.- บาท)</b>
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
          {data.method !== " ONSIDE" && (
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt className="font-medium text-gray-900">แนบหลักฐานการชำระ</dt>
              <dd className="text-gray-700 sm:col-span-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInput}
                  onChange={onChange}
                  className="hidden file-input file-input-xs file-input-bordered w-full max-w-xs bg-white"
                />
                {preview && data.status === "PENDING" && (
                  <div className="my-2">
                    <img src={preview} alt="slip" className="w-44" />
                  </div>
                )}
                <div className="flex flex-col mt-4 w-auto md:w-48  gap-4">
                  {preview && data.status === "PENDING" && (
                    <React.Fragment>
                      <button
                        onClick={onUpload}
                        disabled={loading}
                        className="btn btn-sm w-full md:w-auto text-white hover:bg-green-700 bg-green-600 border-green-600"
                      >
                        <FaCheckCircle />{" "}
                        {loading ? "กำลังอัพโหลด" : "ยืนยันการชำระเงิน"}
                      </button>
                      <button
                        onClick={onCancel}
                        disabled={loading}
                        className="btn btn-sm w-full md:w-auto text-white hover:bg-red-700 bg-red-600 border-red-600"
                      >
                        <FaBan /> ยกเลิกการชำระเงิน
                      </button>
                    </React.Fragment>
                  )}

                  {data.status === "WAIT" && <h1>รอการตรวจสอบการชำระเงิน</h1>}

                  {!preview && data.status === "PENDING" && (
                    <button
                      onClick={onClick}
                      className="btn btn-sm w-full md:w-auto text-white hover:bg-blue-700 bg-blue-600 border-blue-600"
                    >
                      <FaUpload /> เลือกไฟล์การชำระเงิน
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

  return (
    <div className="flow-root rounded-lg border bg-white border-blue-500-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">รหัสการจอง</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.id}</dd>
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
          <dd className="text-gray-700 sm:col-span-2">{data.name}</dd>
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
          <dt className="font-medium text-gray-900">รายการสินค้า</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {data.reservationProductItem.map((item, index) => (
              <div className="flex gap-2" key={item.id}>
                {/* @ts-ignore */}
                <p className="text-gray-700">{item?.productId?.name}</p>
                <p className="text-gray-700">
                  {/* @ts-ignore */}
                  {item.optionId.name}
                </p>
                <p>x {item.quantity} ชิ้น</p>
                {/* @ts-ignore */}
                {item.optionId.price * item.quantity} บาท
              </div>
            ))}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ราคาสุทธิ</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {data.reservationProductItem.reduce(
              (prev, cur) =>
                prev +
                // @ts-ignore
                cur.optionId.price * cur.quantity,
              0
            )}
            .- บาท
          </dd>
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
        {data.method !== " ONSIDE" && (
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">แนบหลักฐานการชำระ</dt>
            <dd className="text-gray-700 sm:col-span-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInput}
                onChange={onChange}
                className="hidden file-input file-input-xs file-input-bordered w-full max-w-xs bg-white"
              />
              {preview && data.status === "PENDING" && (
                <div className="my-2">
                  <img src={preview} alt="slip" className="w-44" />
                </div>
              )}
              <div className="flex flex-col mt-4 w-auto md:w-48  gap-4">
                {preview && data.status === "PENDING" && (
                  <React.Fragment>
                    <button
                      onClick={onUpload}
                      disabled={loading}
                      className="btn btn-sm w-full md:w-auto text-white hover:bg-green-700 bg-green-600 border-green-600"
                    >
                      <FaCheckCircle />{" "}
                      {loading ? "กำลังอัพโหลด" : "ยืนยันการชำระเงิน"}
                    </button>
                    <button
                      onClick={onCancel}
                      disabled={loading}
                      className="btn btn-sm w-full md:w-auto text-white hover:bg-red-700 bg-red-600 border-red-600"
                    >
                      <FaBan /> ยกเลิกการชำระเงิน
                    </button>
                  </React.Fragment>
                )}

                {data.status === "WAIT" && <h1>รอการตรวจสอบการชำระเงิน</h1>}

                {!preview && data.status === "PENDING" && (
                  <button
                    onClick={onClick}
                    className="btn btn-sm w-full md:w-auto text-white hover:bg-blue-700 bg-blue-600 border-blue-600"
                  >
                    <FaUpload /> เลือกไฟล์การชำระเงิน
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
