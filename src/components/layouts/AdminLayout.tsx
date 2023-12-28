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
  titile?: string;
};

export default function AdminLayout({ children, titile }: Props) {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [data, setData] = useState<ReservationTableData[]>();

  useEffect(() => {
    async function loadData() {
      const res = await ReservationTable.getReservations();
      setData(res);
    }
    // Only run query once user is logged in.
    if (user) loadData();
  }, [user]);

  if (!user)
    return (
      <Auth
        redirectTo="/"
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        supabaseClient={supabaseClient}
        socialLayout="horizontal"
        showLinks={false}
      />
    );

  return (
    <React.Fragment>
      <AdminNavbar />
      {titile && (
        <div className="flex flex-col items-center justify-center w-full h-20">
          <h1 className="text-3xl font-bold text-white mt-20 sm:mt-auto text-center  ">
            {titile}
          </h1>
        </div>
      )}
      <div className="py-10 px-2 md:py-4 md:p-4">{children}</div>
    </React.Fragment>
  );
}
