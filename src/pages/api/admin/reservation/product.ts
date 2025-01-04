import type { NextApiRequest, NextApiResponse } from "next";
import ReservationProduct from "@/classes/ReservationProduct";
import ReservationProductItem from "@/classes/ReservationProductItem";
import { mail, type MailData } from "@/libs/mailProduct";

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
            case "PATCH":
                const type = req.body.type as string;
                let detail: string = ``;
                let reservation = null;

                if (type === "product") {
                    const reservationProduct = await ReservationProduct.updateReservation(
                    {
                        id: req.body.id,
                        item_status: req.body.status,
                        trackingCode: req.body.trackingCode,
                    }
                    );
                    const resItem =
                        await ReservationProductItem.getReservationProductItemByOrderId(
                            req.body.id
                        );
        
                    resItem.forEach((item: any) => {
                    detail += `<br />${item.productId.name}`;
                    detail += ` ${item.optionId.name} x ${item.quantity} ชิ้น`;
                    });
        
                    reservation = reservationProduct;
                } else {
                    res.status(400).json({ message: "Bad Request" });
                }

                const mailPayload: MailData = {
                    name: reservation.name,
                    email: reservation.email,
                    phone: reservation.phone,
                    address: reservation.address,
                    reservationType: type === "table" ? "จองโต๊ะ" : "จองสินค้า",
                    detail: detail,
                    trackingCode: reservation.trackingCode,
                };
        
                mail(mailPayload).then((res) =>
                    console.log(
                    `send mail: จัดส่งสินค้าแล้ว ${reservation.id}, to  ${reservation.email}`
                    )
                );
        
                res.status(200).json({ message: "success", data: reservation });
                break;
            default:
                res.status(400).json({ message: "Bad Request" });
                break;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}