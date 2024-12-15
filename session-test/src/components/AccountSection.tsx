"use client"

import { Divider, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Image from "next/image";
import ModalAccount from "./Modal/ModalAccount";

interface AccountSectionProps {
	children: React.ReactNode
}

export default function AccountSection({ children }: AccountSectionProps) {
	return (
    <>
      <div className="bg-slate-500 text-white">
        <Navbar>
          <NavbarBrand className="flex gap-3">
            <Image
              src="/assets/enviloup.png"
              alt="enviloup"
              width={60}
              height={60}
            />
            <p className="font-bold text-lg">Enviloup Team</p>
          </NavbarBrand>
          <NavbarContent
            className="hidden sm:flex gap-4"
            justify="end"
					>
						{children}
					</NavbarContent>
        </Navbar>
      </div>
      <Divider />
    </>
  );
}
