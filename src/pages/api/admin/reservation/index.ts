import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    res.status(200).json({ message: "success", data: "Data" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
