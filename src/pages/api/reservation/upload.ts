import type { NextApiRequest, NextApiResponse } from "next";
import Reservation, {
  type ReservationTableData,
} from "@/classes/ReservationTable";
import { type TableData } from "@/classes/Table";
import notify, { NotifyData } from "@/libs/notify";

type Data = {
  message: string;
  data?: ReservationTableData | ReservationTableData[] | any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "PATCH":
        const data = (await Reservation.updateReservation(
          req.body
        )) as ReservationTableData;

        const table = data.tableId as TableData;

        const LINEPayload: NotifyData = {
          message: `\n💵 มีการแจ้งชำระเงินการจองโต๊ะ 🍽️
                    \n\nรหัสการจอง: ${data.id}
                    \n\nโต๊ะที่: ${table.index}
                    \n\nชื่อ: ${data.name}
                    \n\nเบอร์โทร: ${data.phone}
                    \n\nอีเมล: ${data.email}
                    \n\nรุ่นที่: ${data.generation}
                    \n\nสลิป: ${data.slip}`,
          stickerId: 16581273,
          stickerPackageId: 8522,
        };

        notify(LINEPayload, "dinner").then((res) =>
          console.log(`send notify: การชำระเงินเรียบร้อย`)
        );

        res.status(200).json({ message: "success", data: data });
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
