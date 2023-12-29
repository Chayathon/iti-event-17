import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Stat from "@/components/Cards/Manage/Stat";
import { Data } from "@/interfaces/Stat.type";
import ReservationTable from "@/components/Table/Manage/Reservation";
import axios, { fetcher } from "@/libs/axios";
import useSWR from "swr";

type Props = {};

export default function Manage({}: Props) {
  const {
    data: stat,
    error,
    isLoading,
  } = useSWR<Data>("/admin/reservation", fetcher);

  if (error) {
    console.error(error);
    return <div>failed to load</div>;
  }

  if (isLoading)
    return (
      <AdminLayout titile="ตรวจสอบรายการชำระเงิน">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout titile="ตรวจสอบรายการชำระเงิน">
      <Stat data={stat} />
      <ReservationTable data={stat} />
    </AdminLayout>
  );
}
