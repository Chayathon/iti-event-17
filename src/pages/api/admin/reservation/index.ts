import type { NextApiRequest, NextApiResponse } from "next";
import ReservationTable, {
  type ReservationTableData,
} from "@/classes/ReservationTable";
import ReservationProduct from "@/classes/ReservationProduct";
import Table, { type TableData } from "@/classes/Table";
import { type StatusPayment } from "@/interfaces/Payment.type";

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
        const type = req.body.type as string;
        let reservation = null;
        if (type === "table") {
          const reservationTable = await ReservationTable.updateReservation(
            req.body as ReservationTableData
          );
          await Table.updateTable({
            id: req.body.tableId,
            isReserved: convertReserved(req.body.status),
          });

          reservation = reservationTable;
        } else if (type === "product") {
          const reservationProduct = await ReservationProduct.updateReservation(
            {
              id: req.body.id,
              status: req.body.status,
              slip: req.body.slip,
            }
          );
          reservation = reservationProduct;
        } else {
          res.status(400).json({ message: "Bad Request" });
        }

        res.status(200).json({ message: "success", data: reservation });

        break;

      default:
        res.status(400).json({ message: "Bad Request" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function convertReserved(status: StatusPayment) {
  switch (status) {
    case "COMPLETE":
      return true;
    case "PENDING":
      return false;
    case "FAILS":
      return false;
    case "WAIT":
    default:
      return false;
  }
}
