import React from "react";
import HomeNavbar from "@/components/Navbar/HomeNavbar";

type Props = {
  children?: React.ReactNode;
  title?: string;
};

export default function HomeLayout({ children, title }: Props) {
  return (
    <React.Fragment>
        <HomeNavbar />
        {title && (
          <div className="flex flex-col items-center justify-center w-full mt-4 h-20">
            <h1 className="text-4xl font-bold text-white text-center">
              {title}
            </h1>
          </div>
        )}
        {children}
    </React.Fragment>
  );
}
