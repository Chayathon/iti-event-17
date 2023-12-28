import supabase from "@/libs/supabase";
import ShortUniqueId from "short-unique-id";

export type ReservationProductItemData = {
  id?: string;
  orderId?: string; //orderId
  productId?: string;
  optionId?: string;
  price?: number;
  quantity?: number;
};

export default class ReservationProductItem {
  public static async getReservationProductItems() {
    const { data, error } = await supabase
      .from("reservationProductItem")
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

  public static async getReservationProductItem(id: string) {
    const { data, error } = await supabase
      .from("reservationProductItem")
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

  public static async getReservationProductItemByReservationProductId(
    reservationProductId: string
  ) {
    const { data, error } = await supabase
      .from("reservationProductItem")
      .select(
        `
                        *
                        `
      )
      .eq("reservationProductId", reservationProductId);

    if (error) {
      throw error;
    }
    return data;
  }

  //get by orderId
  public static async getReservationProductItemByOrderId(orderId: string) {
    const { data, error } = await supabase
      .from("reservationProductItem")
      .select(
        `
                        *,
                        productId(*),
                        optionId(*)
                        `
      )
      .eq("orderId", orderId);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async createReservationProductItem(
    reservationProductId: string,
    productId: string,
    optionId: string,
    price: number,
    quantity: number
  ) {
    const id = new ShortUniqueId().randomUUID(6);
    const { data, error } = await supabase
      .from("reservationProductItem")
      .insert([
        {
          id,
          reservationProductId,
          productId,
          optionId,
          price,
          quantity,
        },
      ]);

    if (error) {
      throw error;
    }
    return data;
  }

  // make many insert at once
  public static async createReservationProductItems(
    // reservationProductId: string,
    productItems: ReservationProductItemData[]
  ) {
    try {
      const { data, error } = await supabase
        .from("reservationProductItem")
        .insert(productItems)
        .select(`*, optionId(name,price), productId(name)`);

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  public static async updateReservationProductItem(
    id: string,
    reservationProductId: string,
    productId: string,
    option: string,
    price: number,
    quantity: number
  ) {
    const { data, error } = await supabase
      .from("reservationProductItem")
      .update({
        reservationProductId,
        productId,
        option,
        price,
        quantity,
      })
      .eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async deleteReservationProductItem(id: string) {
    const { data, error } = await supabase
      .from("reservationProductItem")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  }
}
