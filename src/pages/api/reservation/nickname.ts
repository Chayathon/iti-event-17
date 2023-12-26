import type { NextApiRequest, NextApiResponse } from "next";
import Reservation, {
  type ReservationTableData,
} from "@/classes/ReservationTable";

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
      //   case "GET":
      //     break;
      case "GET":
        const reservation = await Reservation.getReservationByNickname();

        res.status(200).json({ message: "success", data: reservation });
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
