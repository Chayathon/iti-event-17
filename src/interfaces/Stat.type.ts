import { type ReservationTableData } from "@/classes/ReservationTable";
import { type ReservationProductData } from "@/classes/ReservationProduct";

export interface Root {
  message: string;
  data: Data;
}

export interface Data {
  table: ReservationTableData[];
  product: ReservationProductData[];
}
