import type { NextApiRequest, NextApiResponse } from "next";
import ReservationTable, {
  type ReservationTableData,
} from "@/classes/ReservationTable";
import ReservationProduct from "@/classes/ReservationProduct";
import ReservationProductItem from "@/classes/ReservationProductItem";
import Table from "@/classes/Table";
import { type StatusPayment } from "@/interfaces/Payment.type";
import { mail, type MailData } from "@/libs/mail";
import moment from "moment";
import "moment/locale/th";

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
        const reservationTable = await ReservationTable.getReservations();
        const reservationProduct = await ReservationProduct.getReservations();

        const payload = {
          table: reservationTable,
          product: reservationProduct,
        };

        res.status(200).json({ message: "success", data: payload });
        break;

      case "PATCH":
        const type = req.body.type as string;
        let detail: string = ``;

        let reservation = null;
        if (type === "table") {
          const reservationTable = await ReservationTable.updateReservation({
            id: req.body.id,
            status: req.body.status,
            refId: req.body.refId,
          });
          await Table.updateTable({
            id: req.body.tableId,
            isReserved: convertReserved(req.body.status),
          });

          reservation = reservationTable;
        } else if (type === "product") {
          const reservationProduct = await ReservationProduct.updateReservation(
            {
              id: req.body.id,
              status: req.body.status,
              refId: req.body.refId,
            }
          );
          const resItem =
            await ReservationProductItem.getReservationProductItemByOrderId(
              req.body.id
            );

          let total: number = 0;

          resItem.forEach((item: any) => {
            detail += `<br />${item.productId.name}`;
            detail += ` ${item.optionId.name} x ${item.quantity} ชิ้น`;

            total += item.price * item.quantity;

            detail += `<br />ราคา ${item.price * item.quantity} บาท<br />`;
          });
          detail += `<br />ราคารวม ${total} บาท<br />`;

          reservation = reservationProduct;
        } else {
          res.status(400).json({ message: "Bad Request" });
        }

        const mailPayload: MailData = {
          name: reservation.name,
          email: reservation.email,
          generation: reservation.generation,
          paymentMethod: reservation.method,
          date: moment(reservation.created_at).format("lll"),
          reservationId: reservation.id,
          reservationType: type === "table" ? "จองโต๊ะ" : "จองสินค้า",
          detail: detail,
        };

        mail(mailPayload).then((res) =>
          console.log(
            `send mail: การจองโต๊ะ ${reservation.id}, to  ${reservation.email}`
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

function convertReserved(status: StatusPayment) {
  switch (status) {
    case "COMPLETE":
      return true;
    case "PENDING":
      return false;
    case "FAILS":
      return false;
    case "WAIT":
    default:
      return false;
  }
}
