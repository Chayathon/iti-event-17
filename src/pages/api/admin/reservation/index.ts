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
        await getReservation(req, res);
        break;

      default:
        break;
    }

    res.status(200).json({ message: "success", data: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getReservation(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const product = await ReservationProduct.getReservations();
    const table = await ReservationTable.getReservations() as ReservationTableData[];

    let success = [];
    let wait = [];
    let pending = [];
    let fails = [];

    product.forEach((item: ReservationTableData) => {
    
      item.type = "PRODUCT";
      if (item.status === "COMPLETE") {
        success.push(item);
      } else if (item.status === "WAIT") {
        wait.push(item);
      } else if (item.status === "PENDING") {
        pending.push(item);
      } else if (item.status === "FAILS") {
        fails.push(item);
      }
    });


    table.forEach((item) => {
      item.type = "TABLE";
      if (item.status === "COMPLETE") {
        success.push(item);
      } else if (item.status === "WAIT") {
        wait.push(item);
      } else if (item.status === "PENDING") {
        pending.push(item);
      } else if (item.status === "FAILS") {
        fails.push(item);
      }
    });

    const data = {
      SUCCESS: success,
      WAIT: wait,
      PENDING: pending,
      FAILS: fails,
    };

    res.status(200).json({ message: "success", data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
