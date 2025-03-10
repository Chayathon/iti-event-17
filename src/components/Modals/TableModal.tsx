import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "@/libs/axios";
import { TableData } from "@/classes/Table";
import SwitchField from "@/components/Switch/SwitchField";

type DataForm = {
  isAvailable: boolean;
  name: string;
  index: number;
  isReserved: boolean;
  isRetail: boolean;
  isHidden: boolean;
};

export default function TableModal({ selected }: { selected?: any }) {
  const [isloading, setIsloading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<DataForm>({
    defaultValues: {
      isAvailable: false,
      isRetail: false,
      isReserved: false,
      isHidden: false,
      name: "",
      index: 0
    }
  });

  const [switchValues, setSwitchValues] = useState<Record<string, boolean>>({
    isAvailable: false,
    isRetail: false,
    isReserved: false,
    isHidden: false,
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

  function onSubmit(data: DataForm) {
    const modalElement = document.getElementById(
      "tableModal"
    ) as HTMLDialogElement | null;
    modalElement.close();
    onSave(data);
  }

  async function onSave(data: DataForm) {
    try {
      setIsloading(true);

      const payload: TableData = {
        name: data.name,
        index: data.index,
        ...switchValues,
      };

      const res = await axios.post("/tables", payload);

      const resData = await res.data;

      if (resData.message === "Success") {
        handleClose();

        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          icon: "success",
          timer: 3000,
        })
      }
    } catch (error) {
      handleClose();
      console.error(error);

      Swal.fire({
        title: "บันทึกข้อมูลไม่สำเร็จ",
        icon: "error",
        timer: 3000,
      });
    } finally {
      setIsloading(false);
    }
  }

  // Modified switch handlers to handle events properly
  const registerSwitch = (name: keyof DataForm) => ({
    onChange: (e: any) => {
      // Check if the event is a synthetic event or a boolean
      const value = typeof e === 'boolean' ? e : e?.target?.checked;

      setSwitchValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    checked: switchValues[name] ?? false,
  });

  return (
    <React.Fragment>
      <dialog id="tableModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box lg:w-11/12 lg:max-w-5xl no-scrollbar overflow-y-auto bg-white text-black">
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
                  desc="สถานะโต๊ะอาหาร พร้อมให้บริการหรือไม่"
                  mt="mt-[20px]"
                  mb="mb-[0px]"
                  {...registerSwitch('isAvailable')}
                />
              </div>
              <div className="sm:col-span-2">
                <SwitchField
                  id="isRetail"
                  label="โต๊ะเป็นขายปลีก"
                  desc="โต๊ะนี้เป็นโต๊ะขายปลีก ไม่สามารถจองได้ รายบุคคล"
                  mt="mt-[20px]"
                  mb="mb-[0px]"
                  {...registerSwitch('isRetail')}
                />
              </div>
              <div className="sm:col-span-2">
                <SwitchField
                  id="isReserved"
                  label="สถานะการจองโต๊ะ"
                  desc="สถานะการจองโต๊อาหาร โต๊ะนี้ถูกจองไปแล้วหรือไม่"
                  mt="mt-[20px]"
                  mb="mb-[0px]"
                  {...registerSwitch('isReserved')}
                />
              </div>
              <div className="sm:col-span-2">
                <SwitchField
                  id="isHidden"
                  label="ซ่อนโต๊ะ"
                  desc="ซ่อนโต๊ะอาหาร ไม่แสดงในหน้าจอ"
                  mt="mt-[20px]"
                  mb="mb-[0px]"
                  {...registerSwitch('isHidden')}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="index"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  ลำดับโต๊ะ
                </label>
                <div className="mt-2.5">
                  <input
                    type="number"
                    {...register("index", { required: true, valueAsNumber: true })}
                    id="index"
                    autoComplete="off"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-red-600">
                    {errors.index?.message}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  ชื่อโต๊ะอาหาร
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    id="name"
                    autoComplete="name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span className="text-red-600">
                    {errors.name?.message}
                  </span>
                </div>
              </div>
            </div>
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
          <div className="modal-action">
            <form method="dialog modal-backdrop">
              <button
                type="button"
                onClick={handleClose}
                disabled={isloading}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
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