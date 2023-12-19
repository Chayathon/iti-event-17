import type { NextApiRequest, NextApiResponse } from "next";
import FAQ, { type FAQData } from "@/classes/FAQ";

type Data = {
  message: string;
  data?: FAQData | FAQData[] | any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "GET":
        const faq = await FAQ.getFAQs();
        res.status(200).json({ message: "success", data: faq });
        break;
      case "POST":
        const newFAQ = await FAQ.createFAQ(req.body);
        res.status(200).json({ message: "success", data: newFAQ });
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
