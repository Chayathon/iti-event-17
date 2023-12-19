import React from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from '@/libs/axios';

type Props = {};

type FormValues = {
  search: string;
};

export default function Tracking({}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function onSubmit(data: FormValues) {
    const search = data.search;

    const res = await axios.get(`/tarcking/search?search=${search}`);

    console.log(res.data);
  }

  return (
    <HomeLayout titile="ตรวจสอบดำเนินการ">
      <div className="text-center ">
        <p className="text-white text-lg md:text-2xl">
          ตรวจสอบสถานะการดำเนินการของการจองของคุณ
        </p>
      </div>
      <div className="max-w-md mx-auto p-6  ">
        <div className="relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="เบอร์โทรศัพท์ หรือ อีเมล"
              {...register("search", { required: true })}
            />
            <button className="flex justify-center items-center gap-2 absolute inset-y-0 right-0 px-4 text-white bg-blue-500 rounded-r-md">
              <FaSearch /> ค้นหา
            </button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}
