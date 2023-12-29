import type { NextApiRequest, NextApiResponse } from "next";
import { mail } from "@/libs/mail";

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
        const resData = await mail({
          date: "2021-10-10",
          detail: "test",
          email: "nongsomchai2647@gmail.com",
          name: "test",
          paymentMethod: "test",
          reservationId: "test",
          reservationType: "จองสินค้า",
          generation: 1,
        });

        res.status(200).json({ message: "success", data: resData });
      default:
        res.status(400).json({ message: "Bad Request" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
