import type { NextApiRequest, NextApiResponse } from "next";
import Reservation, {
  type ReservationProductData,
} from "@/classes/ReservationProduct";
import { type TableData } from "@/classes/Table";
import notify, { NotifyData } from "@/libs/notify";

type Data = {
  message: string;
  data?: ReservationProductData | ReservationProductData[] | any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "PATCH":
        try {
          const data = await Reservation.updateReservation(req.body);

          const LINEPayload: NotifyData = {
            message: `\n💵 มีการแจ้งชำระเงินการจองสินค้า 📦
                      \n\nรหัสการซื้อ: ${data.id}
                      \n\nชื่อ: ${data.name}
                      \n\nเบอร์โทร: ${data.phone}
                      \n\nอีเมล: ${data.email}
                      \n\nรุ่นที่: ${data.generation}
                      \n\nราคา: ${data.totalPrice}
                      \n\nสลิป: ${data.slip}`,
            stickerId: 16581273,
            stickerPackageId: 8522,
          };

          notify(LINEPayload, "product")
            .then((res) => console.log(`send notify: การชำระเงินเรียบร้อย`))
            .catch((err) => console.error(err));

          res.status(200).json({ message: "success", data: data });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
