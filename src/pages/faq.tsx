import React from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import { GetServerSideProps } from "next";
import { type FAQData } from "@/classes/FAQ";

type Props = {
  faq: FAQData[];
};

export default function FAQ({ faq }: Props) {
  return (
    <HomeLayout titile="คำถามที่พบบ่อย">
      {faq.map((item) => (
        <div key={item.id} className="space-y-4 p-4">
          <details
            className="group rounded-lg bg-gray-300 pb-3 [&_summary::-webkit-details-marker]:hidden"
            open
          >
            <summary className="flex cursor-pointer  items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900">
              <h2 className="font-medium">{item.question}</h2>

              <svg
                className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <p className="mt-4 px-4 leading-relaxed text-gray-700">
              {item.answer}
            </p>
          </details>
        </div>
      ))}
    </HomeLayout>
  );
}



// // server side rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
  const BASE_URL =
    // process.env.NEXT_PUBLIC_VERCEL_URL ||
    // process.env.NEXT_PUBLIC_BASE_URL ||
    "localhost:3000/api/";

  const res = await fetch(`http://${BASE_URL}/faq`);
  const faq = await res.json();

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=59"
  );

  return {
    props: { faq: faq.data },
  };
};
