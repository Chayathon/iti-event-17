import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import { fetcher } from "@/libs/axios";
import ReservationListCard from "@/components/Cards/ReservationListCardAdmin";
import useSWR from "swr";

type Mode = "view" | "approved" | "cancel" | "delete";
type Type = "table" | "product";

export default function ReservationCheckPage() {
  const router = useRouter();
  const segment = router.query.segment;

  if (!segment) return <div>404</div>;

  const mode = segment[0] as Mode;
  const type = segment[1] as Type;
  const id = segment[2] as string;

  if (!["view", "approved", "cancel", "delete"].includes(mode)) {
    return <div>404</div>;
  }

  const { data, error, isLoading } = useSWR(
    `/admin/reservation/check?type=${type}&id=${id}`,
    fetcher
  );

  if (!data && !isLoading) {
    return <div className="text-center max-h-screen">404</div>;
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout titile={` ตรวจสอบการชำระเงิน`}>
      <ReservationListCard
        data={data}
        readOnly={mode === "view"}
        isProduct={type === "product"}
      />
    </AdminLayout>
  );
}
