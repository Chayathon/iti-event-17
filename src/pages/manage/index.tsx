import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Stat from "@/components/Cards/Manage/Stat";
import { Data } from "@/interfaces/Stat.type";
import ReservationTable from "@/components/Table/Manage/Reservation";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import axios, { fetcher } from "@/libs/axios";
import useSWR from "swr";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import HomeLayout from "@/components/layouts/HomeLayout";

type Props = {};

export default function Manage({}: Props) {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  if (!user) {
    return (
      <HomeLayout>
        <div className="grid h-[80vh]">
          <div className="my-auto 2xl:mx-60 xl:mx-40 md:mx-20 sm:mx-10 mx-6">
            <Auth
              appearance={{ theme: ThemeSupa }}
              supabaseClient={supabaseClient}
              providers={[]}
              showLinks={false}
              theme="dark"
            />
          </div>
        </div>
      </HomeLayout>
    );
  } else {
    const {
      data: stat,
      error,
      isLoading,
    } = useSWR<Data>("/admin/reservation", fetcher);

    if (isLoading)
      return (
        <AdminLayout title="ตรวจสอบรายการชำระเงิน">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
          </div>
        </AdminLayout>
      );

    return (
      <AdminLayout title="ตรวจสอบรายการชำระเงิน">
        <Stat data={stat} />
        <ReservationTable data={stat} />
      </AdminLayout>
    );
  }
}
