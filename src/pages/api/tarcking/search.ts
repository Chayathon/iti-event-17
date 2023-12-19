import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  data?: any;
  //   data?: FAQData | FAQData[] | any;
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
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getTracking(search: string) {
    
}
