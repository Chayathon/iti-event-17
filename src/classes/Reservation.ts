import supabase from "@/libs/supabase";

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
    const isReserved = await Reservation.getReservationByTableId(
      reservation.tableId as string
    );

    if (isReserved.length > 0) {
      throw {
        message: "Table is reserved",
      };
    }

    const { data, error } = await supabase
      .from("reservationTable")
      .insert([reservation]);

    if (error) {
      throw error;
    }
    return data;
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
