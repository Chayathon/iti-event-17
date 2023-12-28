import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Stat from "@/components/Cards/Manage/Stat";
import { Data } from "@/interfaces/Stat.type";
import ReservationTable from "@/components/Table/Manage/Reservation";
import axios, { fetcher } from "@/libs/axios";
import useSWR from "swr";

type Props = {};

export default function Manage({}: Props) {
  // const { data: stat, error } = useSWR<Data>("/admin/reservation", fetcher);

  // if (error) {
  //   console.error(error);
  //   return <div>failed to load</div>;
  // }

  async function getStat() {
    try {
      const res = await axios.get("/admin/reservation");
      const x = await res.data;

      return x;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AdminLayout titile="ตรวจสอบรายการชำระเงิน">
      <button className="btn-success" onClick={getStat}>dDD</button>
      {/* {JSON.stringify(stat)} */}
      {/* <Stat
        data={{
          success: stat?.SUCCESS.length,
          pending: stat?.PENDING.length,
          failed: stat?.FAILS.length,
          wait: stat?.WAIT.length,
        }}
      />
      <div className="my-2 ">
        <ReservationTable data={stat} />
      </div> */}
    </AdminLayout>
  );
}
