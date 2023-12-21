import { StatusPayment, PaymentMethod } from "@/interfaces/Payment.type";

export function paymentMethod(method: PaymentMethod) {
  switch (method) {
    case "QRCODE":
      return "QR Code";

    case " ONSIDE":
      return "ชำระเงินที่งาน";

    case "BANK":
      return "โอนผ่านบัญชีธนาคาร";
    default:
      break;
  }
}

export function statusOrder(status: StatusPayment) {
  switch (status) {
    case "PENDING":
      return "รอการชำระเงิน";

    case "WAIT":
      return "รอการตรวจสอบ";

    case "COMPLETE":
      return "ชำระเงินเรียบร้อย";

    case "FAILS":
      return "ชำระเงินไม่สำเร็จ";
    default:
      break;
  }
}

export function statusOrderColor(status: StatusPayment) {
  switch (status) {
    case "PENDING":
      return "text-white badge badge-success";

    case "WAIT":
      return "text-white badge badge-info";
    case "COMPLETE":
      return "text-white badge badge-success";

    case "FAILS":
      return "text-white badge badge-error";
    default:
      break;
  }
}
