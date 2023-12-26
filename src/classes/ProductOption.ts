import supabase from "@/libs/supabase";
import ShortUniqueId from "short-unique-id";

export type ProductOptionData = {
  id?: string;
  created_at?: string; // Assuming you handle the timestamp as a string
  name?: string;
  price?: number;
  productId?: string;
  index?: number;
};

export default class ProductOption {
  public static async getProductOptions() {
    const { data, error } = await supabase
      .from("productOption")
      .select(
        `
                    *
                    `
      )
      .order("index", { ascending: true });

    if (error) {
      throw error;
    }
    return data;
  }

  public static async getProductOption(productId: string) {
    const { data, error } = await supabase
      .from("productOption")
      .select(
        `
                    *
                    `
      )
      .eq("productId", productId);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async createProductOption(data: ProductOptionData) {
    const uid = new ShortUniqueId();
    data.id = uid.randomUUID(6);
    const { error } = await supabase.from("productOption").insert([data]);

    if (error) {
      throw error;
    }
  }
}
