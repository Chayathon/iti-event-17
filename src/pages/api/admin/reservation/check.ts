import type { NextApiRequest, NextApiResponse } from "next";
import ReservationTable, {
  type ReservationTableData,
} from "@/classes/ReservationTable";
import ReservationProduct from "@/classes/ReservationProduct";
import { type TableData } from "@/classes/Table";

type Data = {
  message: string;
  data?: any;
};

type Params = {
  id: string;
  type: "table" | "product";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "GET":
        const params = req.query as Params;
        const { id, type } = params;

        let reservationData = null;
        if (type === "table") {
          reservationData = await ReservationTable.getReservation(id);
        } else {
          reservationData = await ReservationProduct.getReservation(id);
        }
        
        res.status(200).json({ message: "success", data: reservationData });

        break;

      default:
        res.status(400).json({ message: "Bad Request" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
