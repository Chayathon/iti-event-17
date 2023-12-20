import React from "react";
import Link from "next/link";
import {
  FaMagnifyingGlass,
  FaHouse,
  FaClipboard,
  FaLocationPin,
  FaComment,
  FaHandshake,
  FaCircleQuestion,
} from "react-icons/fa6";

type Props = {};

type Menu = {
  title: string;
  href: string;
  target?: string;
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
    title: "รายชื่อผู้เข้าร่วมงาน",
    href: "/participants",
    target: "_self",
    icon: <FaClipboard />,
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
  {
    title: "สถานที่จัดงาน",
    href: "/location",
    target: "_self",
    icon: <FaLocationPin />,
  },
  {
    title: "คำถามที่พบบ่อย",
    href: "/faq",
    target: "_self",
    icon: <FaCircleQuestion />,
  },
  {
    title: "ติดต่อเรา",
    href: "/contact",
    target: "_blank",
    icon: <FaComment />,
  },
];

export default function Navbar({}: Props) {
  return (
    <div className="navbar bg-blue-900 text-white shadow-lg p-0">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} accessKey="btn-bumberger" role="button" className="btn btn-ghost lg:hidden">
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
            className="menu menu-s dropdown-content mt-3 z-[1] p-2 shadow bg-blue-900 rounded-box w-52"
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
          งานสันสัมพันธ์
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
      <div className="navbar-end">
        <Link
          target="_blank"
          href={"/tracking"}
          className="btn btn-info btn-sm text-white mr-11 sm:mr-4"
        >
          <FaMagnifyingGlass />
          ตรวจสอบดำเนินการ
        </Link>
      </div>
    </div>
  );
}
