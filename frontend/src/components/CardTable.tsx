"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
	Divider,
	Link as NextUILink
} from "@nextui-org/react";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import React from "react";

interface CardTableProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  href: string;
}

export default function CardTable({
  name,
  icon,
  description,
  href,
}: CardTableProps) {
  return (
    <Card className="max-w-[300px] bg-white shadow-lg transition-shadow rounded-lg overflow-hidden border border-gray-200 hover:scale-105">
      <CardHeader className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#00B894] to-[#007EA7] text-white">
        <div className="text-3xl">{icon}</div>
        <div>
          <h4 className="font-bold text-xl">{name}</h4>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="p-4">
        <p className="text-gray-700">{description}</p>
      </CardBody>
      <Divider />
      <CardFooter className="p-4 flex justify-end">
				<NextUILink as={Link} href={href}>
					Подробнее {<IoIosArrowRoundForward />}
				</NextUILink>
      </CardFooter>
    </Card>
  );
}
