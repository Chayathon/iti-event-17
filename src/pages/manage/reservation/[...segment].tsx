import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import { fetcher } from "@/libs/axios";
import ReservationListCard from "@/components/Cards/ReservationListCardAdmin";
import useSWR from "swr";
import { FaAngleLeft } from "react-icons/fa6";

type Mode = "view" | "approved" | "cancel" | "delete";
type Type = "table" | "product";

export default function ReservationCheckPage() {
  const router = useRouter();

  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  const segment = router.query.segment;

  if (!Array.isArray(segment) || segment.length < 3) {
    return <div>404</div>;
  }

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

  const handleBack = () => {
    router.back();
  };

  if (error) {
    return <div className="text-center max-h-screen">Error loading data</div>;
  }

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
    <AdminLayout title="ตรวจสอบการชำระเงิน">
      <button onClick={handleBack} className="btn btn-outline btn-sm mb-2"><FaAngleLeft />ย้อนกลับ</button>
      <ReservationListCard
        data={data}
        readOnly={mode === "view"}
        isProduct={type === "product"}
      />
    </AdminLayout>
  );
}
