import React from "react";
import Link from "next/link";
import {
  FaMagnifyingGlass,
  FaHouse,
  FaClipboard,
  FaGuitar,
  FaComment,
  FaHandshake,
  FaMedal,
  FaUtensils,
  FaBagShopping,
  FaUserTie,
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
  // {
  //   title: "ทะเบียนกิจกรรมกีฬาสาย",
  //   href: "https://docs.google.com/forms/d/e/1FAIpQLSfiaW0CGh-7JTbXUI16jF-SSAFPpg5oR-9WFyeNvX6vnl8O8Q/viewform?fbclid=IwAR37Qfb08F2CoJTI-C-aqh8YL7TxH5CpUS3BcXnvtWmulbtkKh4f96W7Eu8",
  //   target: "_target",
  //   icon: <FaMedal />,
  // },
  // {
  //   title: "จองที่นั่งเดี่ยว",
  //   href: "https://docs.google.com/forms/d/e/1FAIpQLSe5LBbWai6KiC32_LQCVmH82ERz3vfeJQ4U8VTL14qWFdnYSw/viewform?fbclid=IwAR3QEsLL7RryTcKDaYa_uETFF2eoIjYChPHd7QHBlPP3hK9oKYMDsgtipJ0",
  //   target: "_target",
  //   icon: <FaClipboard />,
  // },
  // {
  //   title: "สมัครนักดนตรี",
  //   href: "https://docs.google.com/forms/d/e/1FAIpQLSe5LBbWai6KiC32_LQCVmH82ERz3vfeJQ4U8VTL14qWFdnYSw/viewform?fbclid=IwAR0p0SA8AL7e9onQbQhZa-68Xu6CjIDZ5GThkE9HYzTHu7Lu4Oli1hdAItk",
  //   target: "_target",
  //   icon: <FaGuitar />,
  // },
  {
    title: "ยืนยันการชำระเงิน",
    href: "/tracking",
    target: "_self",
    icon: <FaMagnifyingGlass />,
  },
  //   {
  //     title: "ตารางการแข่งขัน",
  //     href: "/schedule",
  //   },
  //   {
  //     title: "กติกาการแข่งขัน",
  //     href: "/rules",
  //   },
  //   {
  //     title: "ผลการแข่งขัน",
  //     href: "/results",
  //   },
  //   {
  //     title: "สถิติการแข่งขัน",
  //     href: "/statistics",
  //   },
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
            className="menu menu-s dropdown-content m-4 z-[1] p-2 shadow bg-blue-900 rounded-box w-52"
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
