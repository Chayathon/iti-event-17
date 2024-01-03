import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCircleCheck } from "react-icons/fa6";
import * as yup from "yup";
import BankInfo from "@/components/BankInfo";
import { yupResolver } from "@hookform/resolvers/yup";
import { type Cart } from "@/interfaces/Cart.type";
import { type ReservationProductData } from "@/classes/ReservationProduct";
import { type ReservationProductItemData } from "@/classes/ReservationProductItem";
import { calculateSubtotal, calculateTotal } from "@/helpers/calculateProduct";
import { PaymentMethod } from "@/interfaces/Payment.type";
import axios from "@/libs/axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const LAST_GENERATION = 28;

const phoneRegex = /^0[0-9]{9}$/;

const schema = yup
  .object({
    firstName: yup.string().required("กรุณากรอกชื่อจริง"),
    lastName: yup.string().required("กรุณากรอกนามสกุล"),
    email: yup
      .string()
      .required("กรุณากรอกอีเมล")
      .email("กรุณากรอกอีเมลให้ถูกต้อง"),
    phone: yup
      .string()
      .required("กรุณากรอกเบอร์โทรศัพท์")
      .matches(phoneRegex, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"),
    generation: yup.number().required("กรุณาเลือกรุ่นการศึกษา"),
    method: yup
      .string()
      .required("กรุณาเลือกวิธีการชำระเงิน") as yup.StringSchema<PaymentMethod>,
    address: yup.string(),
  })
  .required("กรุณากรอกข้อมูลให้ครบถ้วน");

type Props = {};

type ProductItem = {
  id: string;
  productId: string;
  option: string;
  quantity: number;
  price: number;
};

type FormValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  generation?: number;
  method?: PaymentMethod;
  address?: string;
};

export default function ProductModal({}: Props) {
  const router = useRouter();
  const [isloading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Cart[]>([]);
  const [subtotal, setSubtotal] = useState(0.0);
  const [total, setTotal] = useState(0.0);
  const [shipping, setShipping] = useState(0);

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
      "ProductModal"
    ) as HTMLDialogElement | null;
    modalElement.close();
  }

  function handleOpen() {
    const modalElement = document.getElementById(
      "ProductModal"
    ) as HTMLDialogElement | null;
    modalElement.showModal();
    loadProducts();
  }

  function loadProducts() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
      setProducts(cart);

      const subtotal = calculateSubtotal(cart);
      const total = calculateTotal(cart, 0);

      setSubtotal(subtotal);
      setTotal(total);
    }
  }

  function onSubmit(dataFrom: FormValues) {
    handleClose();
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

        onSave(dataFrom);
      }
      if (result.isDismissed) {
        handleOpen();
      }
    });
  }

  async function onSave(dataFrom: FormValues) {
    try {
      setIsLoading(true);

      let productsItem: ReservationProductItemData[] = [];
      const reservationProduct: ReservationProductData = {
        name: dataFrom.firstName + " " + dataFrom.lastName,
        email: dataFrom.email,
        phone: dataFrom.phone,
        generation: dataFrom.generation,
        method: dataFrom.method,
        address: dataFrom.address,
      };

      products.forEach((item) => {
        productsItem.push({
          productId: item.id,
          optionId: item.optionId,
          quantity: item.quantity,
        });
      });

      const payload = {
        ...reservationProduct,
        productsItem,
      };

      const resData = (await axios.post("/reservation/product", payload)).data;

      if (resData.message === "success") {
        handleClose();
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          html: `
          <b>กรุณาชำระภายใน 3 วัน</b>
          <br />
          คุณสามารถส่งหลักฐานการชำระเงินได้ที่หน้า <a href="/tracking?search=${resData?.data?.phone}" target="_blank" class="underline">ยืนยันการชำระ</a> หรือตรวจสอบได้ที่เมนู "ยืนยันการชำระ"
                  `,
          icon: "success",
        }).then(() => {
          localStorage.removeItem("cart");
          router.push(`/tracking?search=${resData?.data?.phone}`);
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <React.Fragment>
      <button
        className="flex justify-center items-center gap-2 w-full py-4 font-bold text-center text-gray-100 uppercase bg-blue-500 rounded-md hover:bg-blue-600"
        onClick={handleOpen}
      >
        <FaCircleCheck /> ชำระเงิน
      </button>
      <dialog id="ProductModal" className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box lg:w-11/12 lg:max-w-5xl no-scrollbar  overflow-y-auto bg-white text-black ">
          <h3 className="font-bold text-lg">กรุณากรอกข้อมูลการชำระเงิน</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-xl sm:mt-10"
          >
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
              {/* <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  ที่อยู่จัดส่งสินค้า
                </label>
                <textarea
                  {...register("address", { required: true })}
                  id="address"
                  autoComplete="off"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <span className="text-red-600">{errors.address?.message}</span>
              </div> */}
            </div>
            <BankInfo />
            {/* loop products */}

            <details className="collapse collapse-arrow bg-gray-200">
              <summary className="collapse-title text-xl font-medium">
                คลิกเพื่อดูรายละเอียดสินค้า
              </summary>
              <div className="collapse-content">
                {products.map((item, index) => (
                  <div key={`list-${item.id}-${index}`} className="mb-2">
                    <h3 className="text-sm text-gray-900">{item.name}</h3>

                    <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                      <div>
                        <dt className="inline">Option: </dt>
                        <dd className="inline">
                          {item.optionName} x {item.quantity}
                        </dd>
                      </div>

                      <div>
                        <dt className="inline">ราคา: </dt>
                        <dd className="inline">{item.price}.-</dd>
                      </div>

                      <div>
                        <dt className="inline">ราคารวม: </dt>
                        <dd className="inline">
                          {item.price * item.quantity}.-
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </details>
            <p className="text-red-600 font-bold my-2">
              *รับสินค้าหน้างาน
              ขออภัยไม่มีบริการจัดส่งสินค้า/หากมีการแก้ไขจะแจ้งให้ทราบ
            </p>
            <div className="mt-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">สรุปรายการสั่งซื้อ</h3>
                <p className="text-lg font-bold text-gray-900">
                  {subtotal}.- บาท
                </p>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">ค่าจัดส่ง</h3>
                <p className="text-lg font-bold text-gray-900">
                  {shipping}.- บาท
                </p>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">รวมทั้งหมด</h3>
                <p className="text-lg font-bold text-gray-900">{total}.- บาท</p>
              </div>
            </div>
            <div className="mt-5">
              <button
                type="submit"
                disabled={isloading || !products.length || !total}
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
