import React from "react";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/layouts/AdminLayout";
import { fetcher } from "@/libs/axios";
import TableModal from "@/components/Modals/TableModal";
import useSWR from "swr";

const TableLayout = dynamic(() => import("@/components/TableLayout"), {
  ssr: false,
  loading: () => <div className="text-center">Loading...</div>,
});

type Props = {};

export default function Table({}: Props) {
  const { data: tables } = useSWR("/tables", fetcher);

  function handleAddTable() {
    const modalElement = document.getElementById(
      "tableModal"
    ) as HTMLDialogElement | null;
    modalElement.showModal();
  }

  return (
    <AdminLayout title="การจัดการจองโต๊ะ">
      <TableModal />
      <div className="flex flex-col my-3 md:my-0">
        <button className="btn btn-success text-white" onClick={handleAddTable}>เพิ่มโต๊ะ</button>
      </div>
      <TableLayout data={tables ?? []} admin />
    </AdminLayout>
  );
}
