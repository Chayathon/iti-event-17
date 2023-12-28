import type { NextApiRequest, NextApiResponse } from "next";
import Table, { type TableData } from "@/classes/Table";

type Data = {
  message: string;
  data?: TableData | TableData[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      const tables = await Table.getTables();
      res.status(200).json({ message: "Success", data: tables });
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}
