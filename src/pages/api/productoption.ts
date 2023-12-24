import { NextApiRequest, NextApiResponse } from "next";

import ProductOption, { type ProductOptionData } from "@/classes/ProductOption";

type Data = {
  message: string;
  data?: ProductOptionData | ProductOptionData[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      const allProductOption = await ProductOption.getProductOptions(
        req.query.productId as string
      );
      res.status(200).json({ message: "Success", data: allProductOption });
      break;
    case "POST":
      const data = req.body;
      await ProductOption.createProductOption(data);
      res.status(200).json({ message: "Success" });
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}
