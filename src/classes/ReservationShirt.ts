import supabase from "@/libs/supabase";
import Table, { TableData } from "@/classes/Table";
import notify from "@/libs/notify";
import ShortUniqueId from "short-unique-id";

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
  refId?: string;
  slip?: string;
  method?: PaymentMethod;
  status?: StatusPayment;
  totalPrice?: number;
  trackingCode?: string;
  address?: string;
  size?: {
    [key: string]: number;
  };
};

export default class ReservationShirt {
  public static async getReservations() {
    const { data, error } = await supabase
      .from("ReservationShirt")
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
      .from("ReservationShirt")
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
      .from("ReservationShirt")
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
      const isReserved = await ReservationShirt.getReservationByTableId(
        reservation.tableId as string
      );

      if (isReserved.length > 0) {
        throw {
          message: "โต๊ะนี้ถูกจองแล้ว",
        };
      }

      const payload = {
        id: new ShortUniqueId().rnd(10),
        tableId: reservation.tableId,
        name: reservation.name,
        phone: reservation.phone,
        email: reservation.email,
        generation: reservation.generation,
        method: reservation.method,
        status: reservation.status,
      };

      const { data, error } = await supabase
        .from("ReservationShirt")
        .insert(payload)
        .select("created_at");

      const tableReservated = (
        await Table.updateTable({
          id: reservation.tableId,
          isReserved: true,
        })
      )[0] as TableData;

      notify({
        message: `🍽️ การจองโต๊ะ (${payload.id}) \nโต๊ะที่: ${tableReservated.index} ถูกจองแล้ว \nโดย: ${reservation.name} \nเบอร์โทร: ${reservation.phone} \nอีเมล: ${reservation.email} \nรุ่น: ${reservation.generation} \nวิธีการชำระเงิน: ${reservation.method}`,
        stickerId: 51626507,
        stickerPackageId: 11538,
      }).then((res) =>
        console.log(`send notify: การจองโต๊ะ ${tableReservated.index}`)
      );

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      throw error;
    }
  }

  public static async updateReservation(reservation: ReservationData) {
    const { data, error } = await supabase
      .from("ReservationShirt")
      .update(reservation)
      .eq("id", reservation.id);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async deleteReservation(id: string) {
    const { data, error } = await supabase
      .from("ReservationShirt")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  }
}
