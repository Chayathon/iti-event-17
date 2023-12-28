import React from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";

type Props = {};

export default function ApprovedPage({}: Props) {
  const router = useRouter();
  const { id } = router.query;
  return (
    <AdminLayout titile={`${id}`}>
      <h1>dawdaw</h1>
    </AdminLayout>
  );
}
