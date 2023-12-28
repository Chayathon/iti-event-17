import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Stat from "@/components/Cards/Manage/Stat";

type Props = {};

export default function Manage({}: Props) {
  return (
    <AdminLayout titile="ตรวจสอบรายการชำระเงิน">
      <Stat />
    </AdminLayout>
  );
}
