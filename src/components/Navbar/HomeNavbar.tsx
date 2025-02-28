import React from "react";
import Link from "next/link";
import {
  FaHandshake,
  FaHouse,
  FaUtensils,
  FaBagShopping,
  FaMagnifyingGlass,
  FaRegFutbol,
  FaGuitar,
  FaComment,
  FaUserTie,
  FaClipboardList,
  FaMedal,
  FaCalendarCheck,
} from "react-icons/fa6";

type Props = {};

type Menu = {
  title: string;
  href: string;
  target?: "_blank" | "_self" | "_target";
  icon?: React.ReactNode;
};

const MENU: Menu[] = [
  {
    title: "หน้าแรก",
    href: "/",
    target: "_self",
    icon: <FaHouse />,
  },
  {
    title: "ดูโต๊ะอาหาร",
    href: "/reservation",
    target: "_self",
    icon: <FaUtensils />,
  },
  {
    title: "ดูสินค้า",
    href: "/shop",
    target: "_self",
    icon: <FaBagShopping />,
  },
  {
    title: "ยืนยันการชำระเงิน",
    href: "/tracking",
    target: "_self",
    icon: <FaMagnifyingGlass />,
  },
  // {
  //   title: "สมัครแข่งขันกีฬาฟุตซอล",
  //   href: "https://docs.google.com/spreadsheets/d/1v11DvOte80LK4ZO0E0x2pVFziRSAiS3N4ASbR8oE3xQ/edit?fbclid=IwY2xjawHs5QNleHRuA2FlbQIxMAABHeqiqYtp-HlkNS_tzs8oyzLQtZkKdmfQu1az4aLSnEct4MfVSKBINZN7ug_aem_BfbcEwT4epOH1kUO2x58tw&pli=1&gid=966458771#gid=966458771",
  //   target: "_target",
  //   icon: <FaRegFutbol />,
  // },
  // {
  //   title: "สมัครนักร้อง/นักดนตรี",
  //   href: "https://docs.google.com/spreadsheets/d/13t2ZXQIdSm0osMUluaMy0gFNvM95JVHzYRiSvf50Na8/edit?fbclid=IwY2xjawHrEM1leHRuA2FlbQIxMAABHTQIpxT4IlvY2tIfP6PtDCadYNueyQsmvVs4sxvLLm2awd1EBpvmaYThHA_aem_0Qg7cdrFXG5Smlnvkmj9UA&gid=0#gid=0",
  //   target: "_target",
  //   icon: <FaGuitar />,
  // },
  {
    title: "ตารางเวลากิจกรรม",
    href: "/schedule",
    target: "_target",
    icon: <FaCalendarCheck />,
  },
  // {
  //   title: "แบบประเมิน",
  //   href: "https://docs.google.com/forms/d/e/1FAIpQLSeQpkQK9ziOJ2I5apdJZi6g2BGURE_ddWym3-jFxHWX8UBkyA/viewform",
  //   target: "_target",
  //   icon: <FaClipboardList />,
  // },
  // {
  //   title: "จองที่นั่งเดี่ยว",
  //   href: "https://docs.google.com/forms/d/e/1FAIpQLSe5LBbWai6KiC32_LQCVmH82ERz3vfeJQ4U8VTL14qWFdnYSw/viewform?fbclid=IwAR3QEsLL7RryTcKDaYa_uETFF2eoIjYChPHd7QHBlPP3hK9oKYMDsgtipJ0",
  //   target: "_target",
  //   icon: <FaClipboard />,
  // },
  // {
  //   title: "สถานที่จัดงาน",
  //   href: "/location",
  //   target: "_self",
  //   icon: <FaLocationPin />,
  // },
  // {
  //   title: "คำถามที่พบบ่อย",
  //   href: "/faq",
  //   target: "_self",
  //   icon: <FaCircleQuestion />,
  // },
  {
    title: "ติดต่อเรา",
    href: "https://www.facebook.com/itis16/",
    target: "_blank",
    icon: <FaComment />,
  },
];

export default function Navbar({}: Props) {
  return (
    <div className="navbar bg-blue-900 text-white shadow-lg p-0">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            accessKey="btn-bumberger"
            role="button"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-s dropdown-content mt-4 ml-3 p-2 z-50 shadow bg-blue-900 rounded-box w-52"
          >
            {MENU.map((menu) => (
              <li key={menu.title}>
                <Link href={menu.href} target={menu.target}>
                  {menu.icon} {menu.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href={"/"} className="btn btn-ghost text-xl hidden md:flex">
          <FaHandshake />
          งานสานสัมพันธ์ ครั้งที่ 17
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex lg:bg-blue-900">
        <ul className="menu menu-horizontal px-1">
          {MENU.map((menu) => (
            <li key={menu.title}>
              <Link href={menu.href} target={menu.target}>
                {menu.icon} {menu.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end px-4">
        <Link href={"/manage"} className="btn btn-sm btn-outline">
          <FaUserTie />
          ทีมงาน
        </Link>
        {/* <Link
          target="_blank"
          href={"/tracking"}
          className="btn bg-amber-400 hover:bg-amber-600 btn-sm text-black mr-11 sm:mr-4"
        >
          <FaMagnifyingGlass />
          ยืนยันการชำระเงิน
        </Link> */}
      </div>
    </div>
  );
}
