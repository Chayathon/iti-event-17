import { type ReservationShirtData } from "@/classes/ReservationShirt";
import { type ReservationTableData } from "@/classes/ReservationTable";
import { statusOrderColor, statusOrder } from "@/helpers/statusOrder";
import { TableData } from "@/classes/Table";
import { FaCashRegister } from "react-icons/fa";
import moment from "moment";
import "moment/locale/th";

type CallbackData = {
  id: string;
  status: string;
};

type CardShirtProps = {
  data: ReservationShirtData;
  callback?: (data: CallbackData) => void;
};

type CardTableProps = {
  data: ReservationTableData;
  callback?: (data: CallbackData) => void;
};

export default function CardTable({ data, callback }: CardTableProps) {
  const table = data.tableId as TableData;

  function onClick() {
    if (callback) {
      const payload: CallbackData = {
        id: data.id,
        status: "PAID",
      };
      callback(payload);
    }
  }

  return (
    <div className="flow-root rounded-lg border bg-white border-blue-500-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">รหัสการจอง</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.id}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">โต๊ะที่จอง</dt>
          <dd className="text-gray-700 sm:col-span-2">
            ({table.index}) {table.name}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">เมื่อวันที่</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {moment(data.created_at).format("lll น.")}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">สถานะการจอง</dt>
          <dd className="text-gray-700 sm:col-span-2">
            <div className={`badge ${statusOrderColor(data.status)}`}>
              {statusOrder(data.status)}
            </div>
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ชื่อ-นามสกุล</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.name}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">เบอร์โทรศัพท์</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.phone}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">อีเมล</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.email}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">แนบหลักฐานการชำระ</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {/* <input
                type="file"
                accept="image/*"
                ref={fileInput}
                className="hidden file-input file-input-xs file-input-bordered w-full max-w-xs bg-white"
              /> */}
            <button
              onClick={onClick}
              className="btn btn-sm text-white hover:bg-blue-700 bg-blue-600 border-blue-600"
            >
              <FaCashRegister /> แจ้งการชำระเงิน
            </button>
          </dd>
        </div>
      </dl>
    </div>
  );
}
