import axios from "@/libs/axios";
import { useRef } from "react";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import { type ReservationShirtData } from "@/classes/ReservationShirt";
import { type ReservationTableData } from "@/classes/ReservationTable";
import ReservationListCard from "@/components/Cards/ReservationListCard";

type Props = {};

type FormValues = {
  search: string;
};

type DataResopnse = {
  table: ReservationTableData[];
  shirt: ReservationShirtData[];
};

export default function Tracking({}: Props) {
  const router = useRouter();
  const { search } = router.query;
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState<DataResopnse>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  async function onSubmit(data: FormValues) {
    try {
      setData(undefined);
      setLoading(true);
      const res = await axios.get(`/tarcking/search?search=${data.search}`);
      const resData = await res.data;
      setData(resData.data as DataResopnse);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (search) {
      setValue("search", search as string);
      onSubmit({ search: search as string });
    }
  }, [search]);

  return (
    <HomeLayout titile="ตรวจสอบดำเนินการ">
      {/* {JSON.stringify(Data)} */}
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
              placeholder="เบอร์โทรศัพท์"
              {...register("search")}
            />
            <button
              type="submit"
              className="flex justify-center items-center gap-2 absolute inset-y-0 right-0 px-4 text-white bg-blue-500 rounded-r-md"
            >
              <FaSearch /> ค้นหา
            </button>
          </form>
        </div>
      </div>
      <div>
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <div className="px-2 md:px-10">
        {Data?.table.length > 0 && (
          <h1 className="text-2xl text-white my-5">🍽️ รายการจองโต๊ะอาหาร</h1>
        )}

        {/* {JSON.stringify(Data?.table)} */}
        <div className="flex gap-4 flex-col">
          {Data &&
            Data?.table.map((item) => (
              <ReservationListCard data={item} key={item.id} />
            ))}
        </div>
      </div>
    </HomeLayout>
  );
}
