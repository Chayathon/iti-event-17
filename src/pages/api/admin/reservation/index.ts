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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "GET":
        const reservationTable = await ReservationTable.getReservations();
        const reservationProduct = await ReservationProduct.getReservations();

        const payload = {
          table: reservationTable,
          product: reservationProduct,
        };

        res.status(200).json({ message: "success", data: payload });
        break;

      case "PATCH":
        res.status(200).json({ message: "success", data: req.body });

        break;

      default:
        res.status(400).json({ message: "Bad Request" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
