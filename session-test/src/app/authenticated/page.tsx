"use client";

import CardTable from "@/components/CardTable";
import { FcDepartment } from "react-icons/fc";
import { GiTeacher } from "react-icons/gi";
import { GrGroup } from "react-icons/gr";
import { MdOutlinePlayLesson } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { PiExam } from "react-icons/pi";
import { GrScorecard } from "react-icons/gr";
import { GrDocumentTest } from "react-icons/gr";
import AccountSection from "@/components/AccountSection";
import { FiLogOut } from "react-icons/fi";
import { Button } from "@nextui-org/react";
import { logout } from "@/api/authApi";

export default function Home() {
	const logoutHandler = async () => {
		try {
			await logout();	
			window.location.href = "/";
		} catch (error) {
			alert((error as Error).message);
		}
	}

  return (
    <>
      <AccountSection>
        <Button isIconOnly variant="light" onPress={logoutHandler}>
          <FiLogOut className="text-xl text-white"/>
        </Button>
      </AccountSection>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 animate-gradient bg-[length:300%_300%] p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-[1200px]">
          <CardTable
            name="Departments"
            icon={<FcDepartment />}
            description="Кафедры университета"
            href="/authenticated/departments"
          />
          <CardTable
            name="Cabinets"
            icon={<SiGoogleclassroom />}
            description="Кабинеты университета"
            href="/authenticated/cabinets"
          />
          <CardTable
            name="Disciplines"
            icon={<MdOutlinePlayLesson />}
            description="Дисциплины университета"
            href="/authenticated/disciplines"
          />
          <CardTable
            name="Groups"
            icon={<GrGroup />}
            description="Группы университета"
            href="/authenticated/groups"
          />
          <CardTable
            name="Lecturers"
            icon={<GiTeacher />}
            description="Преподаватели университета"
            href="/authenticated/lecturers"
          />
          <CardTable
            name="Students"
            icon={<PiStudent />}
            description="Студенты университета"
            href="/authenticated/students"
          />
          <CardTable
            name="Exams"
            icon={<GrDocumentTest />}
            description="Экзамены университета"
            href="/authenticated/exams"
          />
          <CardTable
            name="Statements"
            icon={<GrScorecard />}
            description="Ведомости университета"
            href="/authenticated/statements"
          />
          <CardTable
            name="Marks"
            icon={<PiExam />}
            description="Оценки университета"
            href="/authenticated/marks"
          />
        </div>
      </div>
    </>
  );
}
