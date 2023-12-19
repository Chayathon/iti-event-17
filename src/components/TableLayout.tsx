import React, { useState } from "react";
import { type TableData } from "@/classes/Table";
import { PaymentMethod, type ReservationData } from "@/classes/Reservation";
import { useForm } from "react-hook-form";
import axios from "@/libs/axios";
import Swal from "sweetalert2";
import { useSWRConfig } from "swr";

const LAST_GENERATION = 28;

type Props = {
  data: TableData[];
};

type FormValues = {
  tableId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  generation: number;
  method: string;
};

export default function TableLayout({ data }: Props) {
  const { mutate } = useSWRConfig();
  const [isloading, setIsloading] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<FormValues>();
  const [selected, setSelected] = useState<TableData>();
  function getTableStatus(table: TableData) {
    if (table.isReserved) {
      return "bg-green-500 text-white cursor-not-allowed";
    }

    return "cursor-pointer";
  }

  function onClick(table: TableData) {
    if (table.isReserved || !table.isAvailable) return;

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
      const payload: ReservationData = {
        tableId: data.tableId,
        email: data.email,
        phone: data.phone,
        generation: data.generation,
        method: data.method as PaymentMethod,
        name: `${data.firstName} ${data.lastName}`,
      };

      const res = await axios.post("/reservation", payload);

      const resdata = await res.data;

      if (resdata.message === "success") {
        handleClose();
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          text: "ขอบคุณที่ใช้บริการ",
          icon: "success",
        }).then(() => {
          mutate("/tables");
        });
      }
    } catch (error) {
      console.log(error);
      handleClose();

      Swal.fire({
        title: "บันทึกข้อมูลไม่สำเร็จ",
        text: error.response.data.message as string,
        icon: "error",
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
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
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
                  autoComplete="tel"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
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
                <div className="label">
                  {/* <span className="label-text-alt">Alt label</span> */}
                </div>
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
                  <input
                    type="radio"
                    id="radioOnSite"
                    {...register("method", { required: true })}
                    value={"ONSIDE"}
                  />
                  <div className="relative flex items-center">
                    <label htmlFor="radioOnSite" className="disabled">
                      ชำระหน้างาน
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
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
      <div className="p-0 md:p-10">
        <div className="w-full text-center bg-blue-800 my-5">
          <h1 className="text-white text-xl p-5">หน้าเวที</h1>
        </div>
        <div className="mb-2 flex gap-2">
          <div className="badge badge-neutral bg-gray-200 p-2 text-black">
            ว่าง
          </div>
          <div className="badge badge-neutral bg-green-500 p-2 text-white">
            จองแล้ว
          </div>
          <div className="badge badge-neutral p-2 bg-blue-800 text-white">
            อาจารย์
          </div>
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
                {table.isReserved ? (
                  <b className="text-lg lg:text-2xl text-white">จองแล้ว</b>
                ) : (
                  <b className="text-lg lg:text-2xl">ว่าง</b>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
