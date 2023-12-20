import type { NextApiRequest, NextApiResponse } from "next";
import Reservation, { type ReservationTableData } from "@/classes/ReservationTable";
import notify from '@/libs/notify';

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
      case "GET":
        break;
      case "POST":
        const { body } = req;
        console.log(body.id);

        return res.status(200).json({ message: "OK" });
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
