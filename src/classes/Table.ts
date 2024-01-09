import supabase from "@/libs/supabase";
import ReservationTable, {
  type ReservationTableData,
} from "./ReservationTable";

export type TableData = {
  id: string;
  index: number;
  name: string;
  isAvailable: boolean;
  isReserved: boolean;
  isRetail: boolean;
  isHidden: boolean;
};

export type TableWithReservation = {
  id?: string;
  index?: number;
  name?: string;
  isAvailable?: boolean;
  isReserved?: boolean;
  isRetail?: boolean;
  isHidden?: boolean;
  reservation?: ReservationTableData[];
};

export default class Table {
  public static async getTables() {
    try {
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .order("index", { ascending: true })
        .not("isHidden", "eq", true);

      if (error) {
        throw error;
      }

      // Fetch all reservations at once
      const reservations = await ReservationTable.getPublicReservations();

      // Map reservations to tables
      const newData: TableWithReservation[] = data.map(
        (table: TableWithReservation) => {
          if (table.isRetail || !table.isRetail) {
            table.reservation = reservations.filter(
              (reservation: ReservationTableData) => {
                return reservation.tableId === table.id;
              }
            );
          }
          return table;
        }
      );

      return newData;
    } catch (error) {
      throw error;
    }
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
