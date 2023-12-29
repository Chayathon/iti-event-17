import { type ReservationProductData } from "@/classes/ReservationProduct";
import { type ReservationTableData } from "@/classes/ReservationTable";

export interface Root {
  WAIT: ReservationStatus[];
  FAILS: ReservationStatus[];
  COMPLETE: ReservationStatus[];
  PENDING: ReservationStatus[];
}

//@ts-ignore
export interface ReservationStatus
  extends ReservationProductData,
    ReservationTableData {
  type: string;
}

// export interface Wait {
//   id: string;
//   created_at: string;
//   phone: string;
//   address: any;
//   trackingCode?: string;
//   slip: string;
//   generation: number;
//   totalPrice?: number;
//   status: string;
//   method: string;
//   email: string;
//   refId: any;
//   name: string;
//   type: string;
//   tableId?: string;
//   nickname?: string;
// }

// export interface Fails {
//   id: string;
//   tableId: string;
//   created_at: string;
//   name: string;
//   phone: string;
//   generation: number;
//   method: string;
//   status: string;
//   email: string;
//   refId: any;
//   slip: any;
//   nickname: string;
//   type: string;
// }

// export interface Complete {
//   id: string;
//   tableId: string;
//   created_at: string;
//   name: string;
//   phone: string;
//   generation: number;
//   method: string;
//   status: string;
//   email: string;
//   refId: string;
//   slip: string;
//   nickname: string;
//   type: string;
// }

// export interface Pending {
//   id: string;
//   tableId: string;
//   created_at: string;
//   name: string;
//   phone: string;
//   generation: number;
//   method: string;
//   status: string;
//   email: string;
//   refId: any;
//   slip: any;
//   nickname: string;
//   type: string;
// }
