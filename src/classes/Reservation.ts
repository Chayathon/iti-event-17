import supabase from "@/libs/supabase";
import Table from "@/classes/Table";

export type PaymentMethod = "QRCODE" | " ONSIDE" | "BANK";
export type StatusPayment = "WAIT" | "COMPLETE" | "FAILS";

export type ReservationData = {
  id?: string;
  tableId?: string;
  created_at?: string; // Assuming you handle the timestamp as a string
  name?: string;
  phone?: string;
  email?: string;
  generation?: number;
  method?: PaymentMethod;
  status?: StatusPayment;
};

export default class Reservation {
  public static async getReservations() {
    const { data, error } = await supabase
      .from("reservationTable")
      .select(
        `
            *
            `
      )
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }
    return data;
  }

  public static async getReservation(id: string) {
    const { data, error } = await supabase
      .from("reservationTable")
      .select(
        `
                *
                `
      )
      .eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async getReservationByTableId(tableId: string) {
    const { data, error } = await supabase
      .from("reservationTable")
      .select(
        `
                *
                `
      )
      .eq("tableId", tableId);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async createReservation(reservation: ReservationData) {
    try {
      const isReserved = await Reservation.getReservationByTableId(
        reservation.tableId as string
      );

      if (isReserved.length > 0) {
        throw {
          message: "โต๊ะนี้ถูกจองไปแล้ว",
        };
      }

      const payload = {
        tableId: reservation.tableId,
        name: reservation.name,
        phone: reservation.phone,
        email: reservation.email,
        generation: reservation.generation,
        method: reservation.method,
        status: reservation.status,
      };

      const { data, error } = await supabase
        .from("reservationTable")
        .insert(payload)
        .select("created_at");

      console.log(reservation.tableId);

      const { data: tableData, error: tableError } = await supabase
        .from("tables")
        .update({ isReserved: true })
        .eq("id", reservation.tableId).select("id");

      console.log(reservation.tableId,tableData);

      if (error) {
        console.log(error);
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public static async updateReservation(reservation: ReservationData) {
    const { data, error } = await supabase
      .from("reservationTable")
      .update(reservation)
      .eq("id", reservation.id);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async deleteReservation(id: string) {
    const { data, error } = await supabase
      .from("reservationTable")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  }
}
