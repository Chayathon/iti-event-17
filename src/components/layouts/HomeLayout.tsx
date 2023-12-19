import React from "react";
import HomeNavbar from "@/components/Navbar/HomeNavbar";

type Props = {
  children?: React.ReactNode;
  titile?: string;
};

export default function HomeLayout({ children, titile }: Props) {
  return (
    <React.Fragment>
      <HomeNavbar />
      <div className="flex flex-col items-center justify-center w-full h-20">
        <h1 className="text-3xl font-bold text-white">{titile}</h1>
      </div>
      {children}
    </React.Fragment>
  );
}
