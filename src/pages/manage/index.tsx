import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Stat from "@/components/Cards/Manage/Stat";
import axios from "@/libs/axios";

type Props = {};

export default function Manage({}: Props) {
  async function handleClick() {
    try {
      const res = await axios.get("/admin/reservation");
      console.log(await res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AdminLayout titile="ตรวจสอบรายการชำระเงิน">
      <Stat />
      <button className="btn btn-success" onClick={handleClick}>test</button>
    </AdminLayout>
  );
}
