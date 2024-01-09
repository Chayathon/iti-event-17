import type { NextApiRequest, NextApiResponse } from "next";
import ReservationTable, {
  type ReservationTableData,
} from "@/classes/ReservationTable";
import ReservationProduct from "@/classes/ReservationProduct";
import ReservationProductItem from "@/classes/ReservationProductItem";
import Table from "@/classes/Table";
import { type StatusPayment } from "@/interfaces/Payment.type";
import { mail, type MailData } from "@/libs/mail";
import moment from "moment";
import "moment/locale/th";

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
        const table = await Table.getTables();
        res.status(200).json({ message: "success", data: table });
        break;

      case "PATCH":
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
