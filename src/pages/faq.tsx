import React from "react";
import HomeLayout from "@/components/layouts/HomeLayout";

type Props = {};

export default function FAQ({}: Props) {
  return (
    <HomeLayout titile="คำถามที่พบบ่อย">
      <div className="space-y-4 p-4">
        <details
          className="group rounded-lg bg-gray-300 pb-3 [&_summary::-webkit-details-marker]:hidden"
          open
        >
          <summary className="flex cursor-pointer  items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900">
            <h2 className="font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing?
            </h2>

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
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
            veritatis molestias culpa in, recusandae laboriosam neque aliquid
            libero nesciunt voluptate dicta quo officiis explicabo consequuntur
            distinctio corporis earum similique!
          </p>
        </details>
      </div>
    </HomeLayout>
  );
}
