import React, { useState } from "react";
import * as yup from "yup";
import BankInfo from "@/components/BankInfo";
import { useForm, type UseFormHandleSubmit } from "react-hook-form";
import axios, { fetcher } from "@/libs/axios";
import { type TableWithReservation } from "@/classes/Table";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

import { PaymentMethod } from "@/interfaces/Payment.type";
import { type ReservationTableData } from "@/classes/ReservationTable";
import moment from "moment";
import Swal from "sweetalert2";

const LAST_GENERATION = 29;

const phoneRegex = /^0[0-9]{9}$/;

const schema = yup
  .object({
    tableId: yup.string(),
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
    generation: yup.string().required("กรุณาเลือกรุ่นการศึกษา"),
    method: yup.string().required("กรุณาเลือกวิธีการชำระเงิน"),
  })
  .required("กรุณากรอกข้อมูลให้ครบถ้วน");
type FormValues = {
  tableId?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  generation?: string;
  method?: string;
};

type Props = {
  selected?: TableWithReservation;
};

const MAX_PEOPLE = 8;

export default function PaidModal({ selected }: Props) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [isloading, setIsloading] = useState(false);

  const isDisabled = selected?.reservation?.length >= MAX_PEOPLE;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(schema),
  });

  function handleClose() {
    const modalElement = document.getElementById(
      "reservationModal"
    ) as HTMLDialogElement | null;
    if (modalElement) {
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
      text: "คุณได้ตรวจสอบข้อมูล ว่าถูกต้องแล้วใช่หรือไม่?",
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

    async function onSave(data: FormValues) {
      try {
        setIsloading(true);

        const payload: ReservationTableData = {
          tableId: selected?.id,
          name: `${data.firstName} ${data.lastName}`,
          nickname: data.nickname,
          email: data.email,
          phone: data.phone,
          generation: data.generation,
          method: data.method as PaymentMethod,
          status: "PENDING",
          isRetail: selected.isRetail,
        };

        const res = await axios.post("/reservation", payload);

        const resData = await res.data;

        if (resData.message === "success") {
          handleClose();
          Swal.fire({
            title: "บันทึกข้อมูลสำเร็จ",
            html: `
            <b>กรุณาชำระเงินภายใน 3 วัน</b>
            <br />
            คุณสามารถส่งหลักฐานการชำระเงินได้ที่ <a href="/tracking?search=${resData?.data?.phone}" target="_blank" class="underline">ยืนยันการชำระเงิน</a>
            `,
            icon: "success",
          }).then(() => {
            mutate("/tables");
            router.push(`/tracking?search=${resData?.data?.phone}`);
          });
        }
      } catch (error) {
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
  }

  return (
    <React.Fragment>
      <dialog
        id="reservationModal"
        className="modal modal-bottom sm:modal-middle "
      >
        <div className="modal-box lg:w-11/12 lg:max-w-5xl no-scrollbar overflow-y-auto bg-white text-black ">
          <h3 className="font-bold text-lg">
            หน้าต่างการจอง {selected?.name}{" "}
          </h3>
          {selected?.isRetail
            ? "โต๊ะสำหรับจองรายบุคคล 500.- บาท / คน"
            : "สำหรับเหมาทั้งโต๊ะ 4,000.- บาท / โต๊ะ"}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-xl sm:mt-10"
          >
            {selected?.isRetail && (
              <PeopleList people={selected?.reservation} />
            )}
            <input
              type="hidden"
              {...register("tableId")}
              defaultValue={selected?.id || ""}
            />
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  ชื่อจริง <span className="text-red-700">*</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    {...register("firstName", { required: true })}
                    id="firstName"
                    placeholder="กรุณากรอกชื่อจริง"
                    autoComplete="firstName"
                    disabled={isDisabled}
                    className={`${isDisabled ? "opacity-60 cursor-not-allowed" : "opacity-100"} block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
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
                  นามสกุล <span className="text-red-700">*</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    {...register("lastName", { required: true })}
                    id="lastName"
                    placeholder="กรุณากรอกนามสกุล"
                    autoComplete="lastName"
                    disabled={isDisabled}
                  className={`${isDisabled ? "opacity-60 cursor-not-allowed" : "opacity-100"} block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
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
                  ชื่อเล่น <span className="text-red-700">*</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    {...register("nickname", { required: true })}
                    id="nickname"
                    autoComplete="nickname"
                    placeholder="กรุณากรอกชื่อเล่น"
                    disabled={isDisabled}
                    className={`${isDisabled ? "opacity-60 cursor-not-allowed" : "opacity-100"} block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
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
                  อีเมล <span className="text-red-700">*</span>
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    id="email"
                    autoComplete="email"
                    placeholder="กรุณากรอกอีเมล"
                    disabled={isDisabled}
                    className={`${isDisabled ? "opacity-60 cursor-not-allowed" : "opacity-100"} block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                  <span className="text-red-600">{errors.email?.message}</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  เบอร์โทรศัพท์ <span className="text-red-700">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone", { required: true })}
                  id="phone"
                  autoComplete="off"
                  placeholder="กรุณากรอกเบอร์โทรศัพท์"
                  disabled={isDisabled}
                  className={`${isDisabled ? "opacity-60 cursor-not-allowed" : "opacity-100"} block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
                <span className="text-red-600">{errors.phone?.message}</span>
              </div>
              <label className="form-control md:w-full">
                <div className="label">
                  <label
                    htmlFor="generation"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    รุ่นการศึกษา <span className="text-red-700">*</span>
                  </label>
                </div>
                <select
                  className="select select-bordered bg-white"
                  id="generation"
                  disabled={isDisabled}
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
                <span className="text-red-600">{errors.generation?.message}</span>
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
                disabled={isloading || isDisabled}
                className={`block w-full rounded-md ${
                  isloading || isDisabled
                  ? "bg-gray-600 opacity-75 cursor-not-allowed hover:bg-gray-600" : "bg-indigo-600"
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
    </React.Fragment>
  );
}

type PeoplePosition = {
  register: UseFormHandleSubmit<FormValues>;
};

export function PeopleList({ people }: { people: ReservationTableData[] }) {
  return (
    <div>
      <div className="my-4 font-bold md:text-xl">
        {/* <PeoplePosition register={register} /> */}
        จำนวนคนที่จองปัจจุบัน:{" "}
        <span className={`${people.length >= MAX_PEOPLE ? "text-red-600" : "text-green-600"}`}>
          {people.length} / {MAX_PEOPLE}{" "}
        </span>{" "}
        คน
      </div>
      <details className="collapse collapse-arrow bg-gray-200 my-5">
        <summary className="collapse-title font-medium">
          คลิกเพื่อดูรายชื่อผู้จองท่านอื่น
        </summary>
        <div className="collapse-content">
          {people?.map((reservation) => (
            <div key={reservation.id}>
              <p className="text-sm">
                {" "}
                <span className="font-bold">
                  (รุ่นที่ {reservation.generation})
                </span>{" "}
                {reservation.nickname}{" "}
              </p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export function PeoplePosition({ register }) {
  const MAX_PEOPLE = 8;

  return (
    <fieldset className="flex flex-wrap gap-3">
      <legend className="sr-only">People</legend>
      {Array.from({ length: MAX_PEOPLE }, (_, i) => i + 1).map((people) => (
        <div key={`people-${people}`}>
          <input
            type="radio"
            {...register("people")}
            value={people}
            id={`people-${people}-radio`}
            className="peer hidden"
          />

          <label
            htmlFor={`people-${people}-radio`}
            className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-900 hover:border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white"
          >
            <p className="text-sm font-medium">Texas Tea</p>
          </label>
        </div>
      ))}
    </fieldset>
  );
}
