import type { NextApiRequest, NextApiResponse } from "next";
import Reservation, {
  type ReservationProductData,
} from "@/classes/ReservationProduct";
import { type TableData } from "@/classes/Table";
import notify, { NotifyData } from "@/libs/notify";
import ReservationProductItem from "@/classes/ReservationProductItem";

type Data = {
  message: string;
  data?: ReservationProductData | ReservationProductData[] | any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "PATCH":
        try {
          const data = await Reservation.updateReservation(req.body);

          const resItem = await ReservationProductItem.getReservationProductItemByOrderId(data.id);
          
          let itemList: string = ``;
          let total: number = 0;
    
          resItem.forEach((item: any) => {
            itemList += `\n${item.productId.name}`;
            itemList += `\n${item.optionId.name} x ${item.quantity} ชิ้น`;
    
            total += item.price * item.quantity;
    
            itemList += `\nราคา ${(item.price * item.quantity).toLocaleString()} บาท\n`;
          });

          const shipping: number = data.delivery === 'SHIPPING' ? 50 : 0;

          const LINEPayload: NotifyData = {
            message: `\n💵 การชำระเงินการซื้อสินค้า 📦
                      \n\nรหัสการซื้อ: ${data.id}
                      \n\nชื่อ: ${data.name}
                      \n\nเบอร์โทร: ${data.phone}
                      \n\nอีเมล: ${data.email}
                      \n\nรุ่นที่: ${data.generation}
                      \n\nวิธีรับสินค้า: ${
                        data.delivery === 'SHIPPING'
                          ? 'จัดส่งสินค้า'
                          : data.delivery === 'PICKUP'
                          ? 'รับสินค้าหน้างาน'
                          : 'ไม่ระบุ'
                      }
                      ${
                        data.address
                          ? `\n\nที่อยู่: ${data.address}`
                          : ''
                      }
                      \n\nรายการสินค้า: ${itemList}
                      \nค่าจัดส่ง: ${shipping}
                      \nราคาสุทธิ: ${data.totalPrice.toLocaleString()}
                      \n\nสลิป: ${data.slip}`,
            stickerId: 16581273,
            stickerPackageId: 8522,
          };

          notify(LINEPayload, "product")
            .then((res) => console.log(`send notify: การชำระเงินเรียบร้อย`))
            .catch((err) => console.error(err));

          res.status(200).json({ message: "success", data: data });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
