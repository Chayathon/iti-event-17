import supabase from "@/libs/supabase";

export type FAQData = {
  id?: string;
  question?: string;
  answer?: string;
  isActive?: boolean;
};

export default class FAQ {
  public static async getFAQs() {
    const { data, error } = await supabase
      .from("faq")
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

  public static async getFAQ(id: string) {
    const { data, error } = await supabase
      .from("faq")
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

  public static async getFAQByQuestion(question: string) {
    const { data, error } = await supabase
      .from("faq")
      .select(
        `
                    *
                    `
      )
      .eq("question", question);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async createFAQ(faqData: FAQData) {
    const { data, error } = await supabase.from("faq").insert([faqData]);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async updateFAQ(faqData: FAQData) {
    const { data, error } = await supabase
      .from("faq")
      .update(faqData)
      .eq("id", faqData.id);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async deleteFAQ(id: string) {
    const { data, error } = await supabase.from("faq").delete().eq("id", id);

    if (error) {
      throw error;
    }
    return data;
  }
}
