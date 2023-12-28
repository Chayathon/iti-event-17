import { StatusPayment, PaymentMethod } from "@/interfaces/Payment.type";
import {type ReservationProductData} from '@/classes/ReservationProduct';

export interface Root {
  message: string;
  data: Data;
}

export interface Data {
  SUCCESS: ReservationProductData[];
  WAIT: ReservationProductData[];
  PENDING: ReservationProductData[];
  FAILS: ReservationProductData[];
}

// export interface Success {
//   id: string;
//   tableId: string;
//   created_at: string;
//   name: string;
//   phone: string;
//   generation: number;
//   method: PaymentMethod;
//   status: StatusPayment;
//   email: string;
//   refId: string;
//   slip: string;
//   nickname: string;
//   type: string;
// }

// export interface Wait {
//   id: string;
//   created_at: string;
//   phone: string;
//   address: any;
//   trackingCode?: string;
//   slip: string;
//   generation: number;
//   totalPrice?: number;
//   status: StatusPayment;
//   method: PaymentMethod;
//   email: string;
//   refId: any;
//   name: string;
//   type: string;
//   tableId?: string;
//   nickname?: string;
// }

// export interface Pending {
//   id: string;
//   created_at: string;
//   phone: string;
//   address: any;
//   trackingCode?: string;
//   slip?: string;
//   generation: number;
//   totalPrice?: number;
//   status: StatusPayment;
//   method: PaymentMethod;
//   email: string;
//   refId: any;
//   name: string;
//   type: string;
//   tableId?: string;
//   nickname?: string;
// }
