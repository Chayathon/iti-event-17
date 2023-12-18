import supabase from "@/libs/supabase";

export type TableData = {
  id?: string;
  index?: number;
  name?: string;
  isAvailable?: boolean;
  isReserved?: boolean;
};

export default class Table {
  public static async getTables() {
    const { data, error } = await supabase
      .from("tables")
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

  public static async getTable(id: string) {
    const { data, error } = await supabase
      .from("tables")
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

  public static async createTable(table: TableData): Promise<TableData> {
    const { data, error } = await supabase.from("tables").insert([table]);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async updateTable(table: TableData) {
    const { data, error } = await supabase
      .from("tables")
      .update(table)
      .eq("id", table.id)
      .select("*");

    if (error) {
      throw error;
    }
    return data;
  }

  public static async deleteTable(id: string) {
    const { data, error } = await supabase.from("tables").delete().eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async deleteAllTables() {
    const { data, error } = await supabase.from("tables").delete();

    if (error) {
      throw error;
    }
    return data;
  }

  public static async getTableByIndex(index: number) {
    const { data, error } = await supabase
      .from("tables")
      .select(
        `
                *
                `
      )
      .eq("index", index);

    if (error) {
      throw error;
    }
    return data;
  }
}
