import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/Navbar/AdminNavbar";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import ReservationTable, {
  type ReservationTableData,
} from "@/classes/ReservationTable";

type Props = {
  children?: React.ReactNode;
  title?: string;
};

export default function AdminLayout({ children, title }: Props) {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  if (!user) {
    return (
      <div className="grid h-[100vh]">
        <div className="my-auto 2xl:mx-60 xl:mx-40 md:mx-20 sm:mx-10">
          <Auth
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={[]}
            showLinks={false}
            theme="dark"
          />
        </div>
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <AdminNavbar />
        {title && (
          <div className="flex flex-col items-center justify-center w-full h-20">
            <h1 className="text-3xl font-bold text-white mt-20 sm:mt-auto text-center  ">
              {title}
            </h1>
          </div>
        )}
        <div className="py-10 px-2 md:py-4 md:p-4">{children}</div>
      </React.Fragment>
    );
  }
}
