import type { NextApiRequest, NextApiResponse } from "next";
import Reservation, { type ReservationData } from "@/classes/Reservation";

type Data = {
  message: string;
  data?: ReservationData | ReservationData[] | any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "GET":
        const reservation = await Reservation.getReservations();
        res.status(200).json({ message: "success", data: reservation });
        break;
      case "POST":
        const newReservation = await Reservation.createReservation(req.body);
        res.status(200).json({ message: "success", data: newReservation });
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
