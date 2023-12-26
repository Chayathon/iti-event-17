import supabase from "@/libs/supabase";
import ShortUniqueId from "short-unique-id";
import ProductOption, { type ProductOptionData } from "@/classes/ProductOption";

export type ProductData = {
  id?: string;
  created_at?: string; // Assuming you handle the timestamp as a string
  name?: string;
  price?: number;
  image1?: string;
  image2?: string;
  image3?: string;
  details?: string;
  isActive?: boolean;
  productOption?: ProductOptionData[];
};

export default class Product {
  public static async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
                    *
        ,productOption(id, name, price,productId)
                    `
      )
      .order("created_at", { ascending: true });
    if (error) {
      throw error;
    }
    return data;
  }

  public static async getProduct(id: string) {
    const { data, error } = await supabase
      .from("products")
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

  public static async createProduct(data: ProductData) {
    const uid = new ShortUniqueId();
    data.id = uid.randomUUID(6);
    const { error } = await supabase.from("products").insert([data]);

    if (error) {
      throw error;
    }
  }

  public static async updateProduct(id: string, data: ProductData) {
    const { error } = await supabase.from("products").update(data).eq("id", id);

    if (error) {
      throw error;
    }
  }

  public static async deleteProduct(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      throw error;
    }
  }
  
}
