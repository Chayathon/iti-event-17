import { Analytics } from "@vercel/analytics/react";
import { Kanit } from "next/font/google";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import React, { useState } from "react";
import Head from "next/head";
import "@/styles/background.css";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { ThemeProvider } from "next-themes";

const kanit = Kanit({
  weight: ["400", "500", "600"],
  subsets: ["latin-ext", "thai"],
});

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    })
  );
  return (
    <React.Fragment>
      <Head>
        <title>งานสานสัมพันธ์ ITI ครั้งที่ 17</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ThemeProvider defaultTheme="dark">
          <main className={`${kanit.className} dark`} data-theme="night">
            <Component {...pageProps} />
            <Analytics />
          </main>
        </ThemeProvider>
      </SessionContextProvider>
    </React.Fragment>
  );
}
