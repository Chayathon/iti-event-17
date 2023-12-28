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
            imageFile: data.slip,
            stickerId: 16581273,
            stickerPackageId: 8522,
            message: `\n💵 มีการแจ้งการชำระเงิน\nรหัสการซื้อ: ${data.id}\nโดย: ${data.name}\nเบอร์โทร: ${data.phone}\nอีเมล: ${data.email}\nรุ่นที่: ${data.generation}\nวิธีการชำระเงิน: ${data.method}\nราคา:${data.totalPrice}\nURL: ${data.slip}`,
          };

          notify(LINEPayload, "product")
            .then((res) => console.log(`send notify: การชำระเงินเรียบร้อย`))
            .catch((err) => console.log(err));

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
