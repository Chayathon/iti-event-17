import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="เว็บไซต์เกี่ยวกับการจ้องโต๊ะอาหารและรายละเอียดเกี่ยวกับกิจกรรม สาขา ITI มพจ. ปราจีนบุรี"
        />
        <meta
          name="keywords"
          content="ปราจีนบุรี, ITI, มจพ, งานสานสัมพันธ์, kmutnb, ครั้งที่ 17, 2566, รุ่นที่ 27"
        />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content="somchai2647" />

        {/* Open Graph meta tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iti-event.vercel.app/" />
        <meta property="og:title" content="งานสานสัมพันธ์ ITI ครั้งที่ 17" />
        <meta
          property="og:description"
          content="เว็บไซต์เกี่ยวกับการจ้องโต๊ะอาหารและรายละเอียดเกี่ยวกับกิจกรรม สาขา ITI มพจ. ปราจีนบุรี"
        />
        <meta
          property="og:image"
          content="/homescreen.png"
        />

        {/* Twitter meta tags */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://iti-event.vercel.app/" />
        <meta
          property="twitter:title"
          content="งานสานสัมพันธ์ ITI ครั้งที่ 17"
        />
        <meta
          property="twitter:description"
          content="เว็บไซต์เกี่ยวกับการจ้องโต๊ะอาหารและรายละเอียดเกี่ยวกับกิจกรรม สาขา ITI มพจ. ปราจีนบุรี"
        />
        <meta
          property="twitter:image"
          content="/homescreen.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
