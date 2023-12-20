import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  data: {
    id: string;
    status: string;
  };
};

export default function PaidModal({ data }: Props) {
  const [isloading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  function handleClose() {
    const modalElement = document.getElementById(
      "paidModal"
    ) as HTMLDialogElement | null;
    modalElement.close();
  }

  useEffect(() => {
    const modalElement = document.getElementById(
      "paidModal"
    ) as HTMLDialogElement | null;
    if (data) {
      modalElement.showModal();
    }
  }, [data]);

  async function onSubmit(data: any) {}

  return (
    <dialog id="paidModal" className="modal modal-bottom sm:modal-middle ">
      <div className="modal-box lg:w-11/12 lg:max-w-5xl no-scrollbar  overflow-y-auto bg-white text-black ">
        <h3 className="font-bold text-lg">หน้าต่างแจ้งชำระ รหัสการจอง  </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-xl sm:mt-10"
        >
          {/* <input type="hidden" {...register("tableId")} value={selected?.id} /> */}
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
  );
}
