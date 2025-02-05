"use client"

import { Divider, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Image from "next/image";

interface AccountSectionProps {
	children: React.ReactNode
}

export default function AccountSection({ children }: AccountSectionProps) {
	return (
    <>
      <div className="bg-gradient-to-r from-[#00A878] to-[#007EA7] text-white shadow-md">
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
