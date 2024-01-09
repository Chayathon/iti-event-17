import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm, type UseFormHandleSubmit } from "react-hook-form";
import axios, { fetcher } from "@/libs/axios";
import { type TableData } from "@/classes/Table";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import SwitchField from "@/components/Switch/SwitchField";

import Swal from "sweetalert2";

const phoneRegex = /^0[0-9]{9}$/;

const schema = yup
  .object({
    isAvailable: yup.boolean().required("กรุณาเลือกสถานะโต๊ะอาหาร"),
    name: yup.string().required("กรุณากรอกชื่อโต๊ะอาหาร"),
    index: yup.number().required("กรุณากรอกลำดับโต๊ะ"),
    isReserved: yup.boolean(),
    isRetail: yup.boolean(),
    isHidden: yup.boolean(),
  })
  .required("กรุณากรอกข้อมูลให้ครบถ้วน");

type Props = {
  selected?: TableData;
};

type DataFrom = {
  isAvailable: boolean;
  firstName: string;
  index: number;
  isReserved: boolean;
  isRetail: boolean;
  isHidden: boolean;
};

export default function TableModal({ selected }: Props) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [isloading, setIsloading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DataFrom>({
    // resolver: yupResolver<DataFrom>(schema),
  });

  function handleClose() {
    const modalElement = document.getElementById(
      "tableModal"
    ) as HTMLDialogElement | null;
    if (modalElement) {
      reset();
      modalElement.close();
    }
  }

  function onSubmit(data: DataFrom) {
    const modalElement = document.getElementById(
      "tableModal"
    ) as HTMLDialogElement | null;

    console.log(data);
  }

  useEffect(() => {

  }, [])
  

  return (
    <React.Fragment>
      <dialog id="tableModal" className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box lg:w-11/12 lg:max-w-5xl no-scrollbar  overflow-y-auto bg-white text-black ">
          <h3 className="font-bold text-lg">หน้าต่างการเพิ่มโต๊ะอาหาร</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-xl sm:mt-10"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <SwitchField
                  id="isAvailable"
                  label="สถานะโต๊ะ"
                  desc=" สถานะโต๊ะอาหาร พร้อมให้บริการหรือไม่"
                  mt="mt-[20px]"
                  mb="mb-[0px]"
                  {...register("isAvailable")}
                />
              </div>
              <div className="sm:col-span-2">
                <SwitchField
                  id="isRetail"
                  label=" โต๊ะเป็นขายปลีก"
                  desc=" โต๊ะนี้เป็นโต๊ะขายปลีก ไม่สามารถจองได้ รายบุคคล"
                  mt="mt-[20px]"
                  mb="mb-[0px]"
                  disabled={true}
                  {...register("isRetail")}
                />
              </div>
              <div className="sm:col-span-2">
                <SwitchField
                  id="isReserved"
                  label="สถานะการจองโต๊ะ"
                  desc=" สถานะการจองโต๊อาหาร โต๊ะนี้ถูกจองไปแล้วหรือไม่"
                  mt="mt-[20px]"
                  mb="mb-[0px]"
                  disabled={true}
                  {...register("isReserved")}
                />
              </div>
              <div className="sm:col-span-2">
                <SwitchField
                  id="isHidden"
                  label="ซ่อนโต๊ะ"
                  desc=" ซ่อนโต๊ะอาหาร ไม่แสดงในหน้าจอ"
                  mt="mt-[20px]"
                  mb="mb-[0px]"
                  disabled={true}
                  {...register("isHidden")}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  ลำดับโต๊ะ
                </label>
                <div className="mt-2.5">
                  <input
                    type="number"
                    {...register("index", { required: true })}
                    id="index"
                    autoComplete="off"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-red-600">
                    {errors.firstName?.message}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  ชื่อโต๊ะอาหาร
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
            </div>
            <div className="mt-5">
              <button
                type="submit"
                // disabled={isloading}
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
    </React.Fragment>
  );
}
