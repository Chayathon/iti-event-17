import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Stat from "@/components/Cards/Manage/Stat";
import { Data } from "@/interfaces/Stat.type";
import ReservationTable from "@/components/Table/Manage/Reservation";
import { fetcher } from "@/libs/axios";
import useSWR from "swr";

type Props = {};

export default function Manage({}: Props) {
  const { data: stat, error } = useSWR<Data>("/admin/reservation", fetcher);

  console.log(stat);
  return (
    <AdminLayout titile="ตรวจสอบรายการชำระเงิน">
      {/* {JSON.stringify(stat)} */}
      <Stat
        data={{
          success: stat?.SUCCESS.length,
          pending: stat?.PENDING.length,
          failed: stat?.FAILS.length,
          wait: stat?.WAIT.length,
        }}
      />
      <div className="my-2 ">
        <ReservationTable data={stat} />
      </div>
    </AdminLayout>
  );
}
