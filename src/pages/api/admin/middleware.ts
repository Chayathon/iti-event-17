//make middleware for admin by supabase
import { NextApiRequest, NextApiResponse } from "next";

import supabase from "@/libs/supabase";

const middleware =
  (handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.token;
    const { data: user, error } = await supabase.auth.getSession();

    console.log("user", user);

    if (!user || error) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return handler(req, res);
  };
