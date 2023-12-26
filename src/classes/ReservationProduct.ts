import supabase from "@/libs/supabase";
import Table, { TableData } from "@/classes/Table";
import notify from "@/libs/notify";
import ShortUniqueId from "short-unique-id";

import { PaymentMethod, StatusPayment } from "@/interfaces/Payment.type";

export type ReservationProductItemData = {
  id?: string;
  reservationProductId?: string;
  productId?: string;
  option?: string;
  price?: number;
  quantity?: number;
};

export type ReservationProductData = {
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
  options?: ReservationProductItemData | ReservationProductItemData[];
};

export default class ReservationProduct {
  public static async getReservations() {
    const { data, error } = await supabase
      .from("reservationProduct")
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
      .from("reservationProduct")
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

  public static async getReservationByKeyword(keyword: string, value: string) {
    const { data, error } = await supabase
      .from("reservationProduct")
      .select(
        `
                    *
                    `
      )
      .eq(keyword, value);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async createReservation(data: ReservationProductData) {
    const { error } = await supabase.from("reservationProduct").insert([data]);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async updateReservation(
    id: string,
    data: ReservationProductData
  ) {
    const { error } = await supabase
      .from("reservationProduct")
      .update(data)
      .eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async deleteReservation(id: string) {
    const { error } = await supabase
      .from("reservationProduct")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    return true;
  }

  public static async getReservationByTrackingCode(trackingCode: string) {
    const { data, error } = await supabase
      .from("reservationProduct")
      .select(
        `
                    *
                    `
      )
      .eq("trackingCode", trackingCode);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async updateReservationByTrackingCode(
    trackingCode: string,
    data: ReservationProductData
  ) {
    const { data: reservation, error: reservationError } = await supabase
      .from("reservationProduct")
      .select(
        `
                    *
                    `
      )
      .eq("trackingCode", trackingCode);

    if (reservationError) {
      throw reservationError;
    }

    if (reservation.length === 0) {
      throw {
        message: "ไม่พบรายการจอง",
      };
    }

    const { error } = await supabase
      .from("reservationProduct")
      .update(data)
      .eq("trackingCode", trackingCode);

    if (error) {
      throw error;
    }
    return data;
  }
}
