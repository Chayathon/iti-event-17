import React, { useState } from "react";
import { type TableData } from "@/classes/Table";
import { PaymentMethod } from "@/interfaces/Payment.type";
import { type ReservationTableData } from "@/classes/ReservationTable";
import { useForm } from "react-hook-form";
import axios, { fetcher } from "@/libs/axios";
import Swal from "sweetalert2";
import useSWR, { useSWRConfig } from "swr";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import * as yup from "yup";
import BankInfo from "./BankInfo";
import moment from "moment";
import "moment/locale/th";

const LAST_GENERATION = 28;

const phoneRegex = /^0[0-9]{9}$/;

const schema = yup
  .object({
    tableId: yup.string().required("กรุณาเลือกโต๊ะ"),
    firstName: yup.string().required("กรุณากรอกชื่อจริง"),
    lastName: yup.string().required("กรุณากรอกนามสกุล"),
    nickname: yup.string().required("กรุณากรอกชื่อเล่น"),
    email: yup
      .string()
      .required("กรุณากรอกอีเมล")
      .email("กรุณากรอกอีเมลให้ถูกต้อง"),
    phone: yup
      .string()
      .required("กรุณากรอกเบอร์โทรศัพท์")
      .matches(phoneRegex, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"),
    generation: yup.number().required("กรุณาเลือกรุ่นการศึกษา"),
    method: yup.string().required("กรุณาเลือกวิธีการชำระเงิน"),
  })
  .required("กรุณากรอกข้อมูลให้ครบถ้วน");

type Props = {
  data: TableData[];
};

type FormValues = {
  tableId?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  generation?: number;
  method?: string;
};

export default function TableLayout({ data }: Props) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: nickname } = useSWR("/reservation/nickname", fetcher);
  const [isloading, setIsloading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(schema),
  });
  const [selected, setSelected] = useState<TableData>();

  function getTableStatus(table: TableData) {
    const thisTable = nickname?.find((item) => item.tableId.id === table.id);

    if (thisTable?.status === "PENDING") {
      return "bg-blue-400 text-white cursor-pointer";
    }

    if (!table.isAvailable) {
      return "bg-neutral text-white cursor-not-allowed";
    }

    if (table.isReserved) {
      return "bg-green-500 text-white cursor-pointer";
      //cursor-not-allowed
    }

    return "cursor-pointer";
  }

  async function onClick(table: TableData) {
    if (table.isReserved || !table.isAvailable) {
      const infoTable = nickname?.find((item) => item.tableId.id === table.id);

      Swal.fire({
        title: "โต๊ะนี้ถูกจองแล้ว",
        html: `<b class="font-xl">${infoTable.nickname} รุ่นที่ ${infoTable.generation}
          <br />
        `,
        // เมื่อ ${moment(data.generation).locale("th").format("l")}
        icon: "info",
        timer: 3000,
      });

      return;
    }

    const modalElement = document.getElementById(
      "reservationModal"
    ) as HTMLDialogElement | null;
    if (modalElement) {
      modalElement.showModal();
      setSelected(table);
      setValue("tableId", table.id);
    }
  }

  function handleClose() {
    const modalElement = document.getElementById(
      "reservationModal"
    ) as HTMLDialogElement | null;
    if (modalElement) {
      setSelected(undefined);
      reset();
      modalElement.close();
    }
  }

  function onSubmit(data: FormValues) {
    const modalElement = document.getElementById(
      "reservationModal"
    ) as HTMLDialogElement | null;
    modalElement.close();
    Swal.fire({
      title: "ยืนยันการจอง",
      text: "คุณได้ตรวจสอบข้อมูลว่าถูกต้องแล้วใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ยืนยัน",
      cancelButtonText: "ไม่แน่ใจ, ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังบันทึกข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        onSave(data);
      }
      if (result.isDismissed) {
        modalElement.showModal();
      }
    });
  }

  async function onSave(data: FormValues) {
    try {
      setIsloading(true);

      const payload: ReservationTableData = {
        tableId: data.tableId,
        email: data.email,
        phone: data.phone,
        generation: data.generation,
        method: data.method as PaymentMethod,
        name: `${data.firstName} ${data.lastName}`,
        nickname: data.nickname,
      };

      const res = await axios.post("/reservation", payload);

      const resData = await res.data;

      if (resData.message === "success") {
        handleClose();
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          html: `
          <b>กรุณาชำระภายใน 3 วัน</b>
          <br />
          คุณสามารถส่งหลักฐานการชำระเงินได้ที่หน้า <a href="/tracking?search=${resData?.data?.phone}" target="_blank" class="underline">ตรวจสอบดำเนินการ</a> หรือตรวจสอบได้ที่เมนู "ตรวจสอบดำเนินการ"
                  `,
          icon: "success",
        }).then(() => {
          mutate("/reservation/nickname");
          router.push(`/tracking?search=${resData?.data?.phone}`);
        });
      }
    } catch (error) {
      console.log(error);
      handleClose();

      Swal.fire({
        title: "บันทึกข้อมูลไม่สำเร็จ",
        text: error?.response.data.message as string,
        icon: "error",
        timer: 3000,
      });
    } finally {
      setIsloading(false);
    }
  }

  if (!data) return <div>loading...</div>;

  return (
    <React.Fragment>
      <dialog
        id="reservationModal"
        className="modal modal-bottom sm:modal-middle "
      >
        <div className="modal-box lg:w-11/12 lg:max-w-5xl no-scrollbar  overflow-y-auto bg-white text-black ">
          <h3 className="font-bold text-lg">หน้าต่างการจอง {selected?.name}</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-xl sm:mt-10"
          >
            <input
              type="hidden"
              {...register("tableId")}
              value={selected?.id}
            />
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  ชื่อจริง*
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    {...register("firstName", { required: true })}
                    id="firstName"
                    autoComplete="firstName"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-red-600">
                    {errors.firstName?.message}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  นามสกุลจริง*
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    {...register("lastName", { required: true })}
                    id="lastName"
                    autoComplete="lastName"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-red-600">
                    {errors.lastName?.message}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="nickname"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  ชื่อเล่น*
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    {...register("nickname", { required: true })}
                    id="nickname"
                    autoComplete="nickname"
                    placeholder="ชื่อเล่น: พี่เจมส์ พี่บี"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-red-600">
                    {errors.nickname?.message}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  อีเมล*
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    id="email"
                    autoComplete="email"
                    placeholder="อีเมล: "
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-red-600">{errors.email?.message}</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  เบอร์โทรศัพท์*
                </label>
                <input
                  type="tel"
                  {...register("phone", { required: true })}
                  id="phone"
                  autoComplete="off"
                  placeholder="เบอร์โทรศัพท์: 0812345678"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <span className="text-red-600">{errors.phone?.message}</span>
              </div>
              <label className="form-control md:w-full">
                <div className="label">
                  <label
                    htmlFor="generation"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    รุ่นการศึกษา*
                  </label>
                </div>
                <select
                  className="select select-bordered bg-white"
                  id="generation"
                  {...register("generation", { required: true })}
                >
                  <option value="">กรุณาเลือก</option>
                  {Array.from({ length: LAST_GENERATION }, (_, i) => i + 1).map(
                    (generation) => (
                      <option key={generation} value={generation}>
                        รุ่นที่ {generation}
                      </option>
                    )
                  )}
                </select>
                <span className="text-red-600">
                  {errors.generation?.message}
                </span>

                {/* <div className="label">
                  <span className="label-text-alt">Alt label</span>
                </div> */}
              </label>
              <div className="sm:col-span-2 flex ">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="radioBank"
                    defaultChecked={true}
                    {...register("method", { required: true })}
                    value={"BANK"}
                  />
                  <div className="relative flex items-center">
                    <label htmlFor="radioBank">ชำระผ่านเลขบัญชีธนาคาร</label>
                  </div>
                  {/* <input
                    type="radio"
                    id="radioOnSite"
                    {...register("method", { required: true })}
                    value={"ONSIDE"}
                  />
                  <div className="relative flex items-center">
                    <label htmlFor="radioOnSite" className="disabled">
                      ชำระหน้างาน
                    </label>
                  </div> */}
                </div>
              </div>
            </div>
            <BankInfo />
            <div className="mt-5">
              <button
                type="submit"
                disabled={isloading}
                className={`block w-full rounded-md ${
                  isloading ? "bg-gray-600" : "bg-indigo-600"
                }  px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {isloading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
          <div className="modal-action ">
            <form method="dialog modal-backdrop">
              <button
                type="button"
                onClick={handleClose}
                disabled={isloading}
                className="btn btn-sm  btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isloading}
                className="btn bg-gray-500 btn-sm text-white"
              >
                ยกเลิก
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* {JSON.stringify(nickname)} */}
      <div className="p-0 md:p-10">
        <div className="text-center sm:mt-1 mt-4">
          <b className="text-xl md:text-3xl   text-amber-400  w-full">
            🔔 กรุณาชำระภายใน 3 วัน หลังจากการจองโต๊ะ
          </b>
          <br />
          <span title="มีการโทรแจ้งให้ทราบ 1 ครั้ง"  className="text-xs text-white">
            หากไม่ชำระภายในเวลาที่กำหนด <br />
            หลังจากนั้นถือว่าหลุดจองโต๊ะครับ 🙏
          </span>
        </div>
        <div className="w-full text-center bg-blue-800 my-5">
          <h1 className="text-white text-xl p-5">🎤 หน้าเวที 👯‍♂️</h1>
        </div>
        <div className="mb-2 flex gap-2">
          <div className="badge badge-neutral bg-gray-200 p-2 text-black">
            ว่าง
          </div>
          <div className="badge badge-neutral bg-blue-400 p-2 text-white">
            รอชำระ
          </div>
          <div className="badge badge-neutral bg-green-500 p-2 text-white">
            จองแล้ว
          </div>
          {/* <div className="badge badge-neutral p-2 bg-blue-800 text-white">
            อาจารย์
          </div> */}
          <div className="badge badge-neutral p-2 bg-neutral text-white">
            ไม่พร้อมให้บริการ
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2 w-full">
          {data?.map((table) => (
            <div
              key={table.id}
              onClick={() => onClick(table)}
              className={`flex-1 p-2 ${getTableStatus(
                table
              )}  rounded-md bg-gray-200  text-black text-center lg:w-full lg:h-20 md:w-20 md:h-20 sm:h-12 sm:w-2/3`}
            >
              <p className={table.isReserved ? "text-white" : undefined}>
                {table.name}
              </p>
              <span className="hidden sm:block ">
                {table.isReserved && table.isAvailable && (
                  <b className="text-lg lg:text-2xl text-white">จองแล้ว</b>
                )}
                {!table.isReserved && table.isAvailable && (
                  <b className="text-lg lg:text-2xl">ว่าง</b>
                )}
                {!table.isAvailable && (
                  <b className="text-lg lg:text-xl">ไม่พร้อมให้บริการ</b>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
