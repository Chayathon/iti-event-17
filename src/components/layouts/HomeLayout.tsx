import React from "react";
import HomeNavbar from "@/components/Navbar/HomeNavbar";

type Props = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: Props) {
  return (
    <React.Fragment>
      <HomeNavbar />
      {children}
    </React.Fragment>
  );
}
