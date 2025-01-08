import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FaUtensils,
  FaShirt,
  FaPerson,
  FaMedal,
  FaGuitar,
  FaTag,
} from "react-icons/fa6";
import HomeLayout from "@/components/layouts/HomeLayout";
import PaidModal from "@/components/Modals/PaidModal";
import { type ReservationTableData } from "@/classes/ReservationTable";

const TypingEffect = dynamic(() => import("@/components/TypingEffect"), {
  ssr: false,
});

// const optionModal: ReservationTableData = {
//   isRetail: true,
//   tableId: "963731bb-839f-46ae-92d5-09833a755857",
//   id: "963731bb-839f-46ae-92d5-09833a755857",
// };

export default function Home() {
  // function onClickRetailTable() {
  //   const modalElement = document.getElementById(
  //     "reservationModal"
  //   ) as HTMLDialogElement | null;
  //   if (modalElement) {
  //     modalElement.showModal();
  //   }
  // }

  return (
    <HomeLayout>
      {/* <PaidModal selected={optionModal} /> */}
      <div>
        <section className="mt-36">
          <div className="float-none mx-auto px-4 lg:flex  lg:items-center">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl">
                🎈
                <span className="bg-gradient-to-r bg-clip-text font-extrabold text-transparent from-green-300 mx-2 via-blue-500 to-purple-600">
                  งานสานสัมพันธ์ ครั้งที่ 17
                </span>
                🎈
              </h1>
              <h1 className="bg-gradient-to-r bg-clip-text font-bold whitespace-nowrap text-transparent text-lg sm:text-2xl md:text-4xl from-green-300 via-blue-500 to-purple-600">
                <TypingEffect text={["Information Technology for Industry"]} />
              </h1>
              <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed text-white">
                ทุกช่วงเวลา ร้อยเรียงเป็นเรื่องราวให้เราได้คิดถึง
              </p>
              <p className="my-4 font-bold text-white text-xl sm:text-3xl md:text-4xl">
                แล้วพบกันวันที่ 1 มีนาคม 2568 <br /> เวลา 18:00 น.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <Link
                  className="inline-block w-full rounded-xl border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto duration-150"
                  href="/reservation"
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaUtensils className="translate-y-1" />
                    จองโต๊ะอาหาร
                  </span>
                </Link>
                <Link
                  className="inline-block w-full rounded-xl border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto duration-150"
                  href="/reservation"
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaPerson className="translate-y-1" />
                    จองที่นั่งเดี่ยว
                  </span>
                </Link>

                <Link
                  className="inline-block w-full rounded-xl border border-blue-600 bg-blue-600 px-10 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto duration-150"
                  href="/shop"
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaShirt className="translate-y-1" />
                    จองเสื้อ
                  </span>
                </Link>

                {/* <Link
                  className="inline-block  w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                  target="_blank"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfiaW0CGh-7JTbXUI16jF-SSAFPpg5oR-9WFyeNvX6vnl8O8Q/viewform?fbclid=IwAR37Qfb08F2CoJTI-C-aqh8YL7TxH5CpUS3BcXnvtWmulbtkKh4f96W7Eu8"
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaMedal />
                    ทะเบียนกิจกรรมกีฬาสาย
                  </span>
                </Link> */}

                {/* <Link
                  className="inline-block  w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                  target="_blank"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe5LBbWai6KiC32_LQCVmH82ERz3vfeJQ4U8VTL14qWFdnYSw/viewform?fbclid=IwAR0p0SA8AL7e9onQbQhZa-68Xu6CjIDZ5GThkE9HYzTHu7Lu4Oli1hdAItk"
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaGuitar />
                    สมัครนักดนตรี
                  </span>
                </Link>

                <Link
                  className="inline-block  w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                  target="_blank"
                  href="https://docs.google.com/forms/d/e/1FAIpQLScRFWZqzQhp7SWuTsH3MDPXwaaYNQm8YahddUVKRK5PVchBxg/viewform?fbclid=IwAR0udRDSbMDWzyg6LdU11RI4Y7uZBybIhWojc40qIwBKHfBOo6R9YzPDTCI"
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaTag />
                    สลักพวงกุญเเจ
                  </span>
                </Link> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
