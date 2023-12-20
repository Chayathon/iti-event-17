import { Analytics } from "@vercel/analytics/react";
import { Kanit } from "next/font/google";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import React from "react";
import Head from "next/head";

const kanit = Kanit({
  weight: ["400", "500", "600"],
  subsets: ["latin-ext", "thai"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>งานสานสัมพันธ์ ITI ครั้งที่ 16</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <main className={kanit.className} data-theme="night">
        <Component {...pageProps} />
        <Analytics />
      </main>
    </React.Fragment>
  );
}
