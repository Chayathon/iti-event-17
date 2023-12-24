import type { NextApiRequest, NextApiResponse } from "next";
import Product, { type ProductData } from "@/classes/Product";

type Data = {
  message: string;
  data?: ProductData | ProductData[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      const allProduct = await Product.getProducts();
      res.status(200).json({ message: "Success", data: allProduct });
      break;
    case "POST":
      const data = req.body;
      await Product.createProduct(data);
      res.status(200).json({ message: "Success" });
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}
