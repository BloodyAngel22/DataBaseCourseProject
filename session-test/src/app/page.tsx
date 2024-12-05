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

export default async function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 animate-gradient bg-[length:300%_300%] p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-[1200px]">
        <CardTable
          name="Departments"
          icon={<FcDepartment />}
          description="Кафедры университета"
          href="/departments"
        />
        <CardTable
          name="Cabinets"
          icon={<SiGoogleclassroom />}
          description="Кабинеты университета"
          href="/cabins"
        />
        <CardTable
          name="Disciplines"
          icon={<MdOutlinePlayLesson />}
          description="Дисциплины университета"
          href="/disciplines"
        />
        <CardTable
          name="Groups"
          icon={<GrGroup />}
          description="Группы университета"
          href="/groups"
        />
        <CardTable
          name="Lecturers"
          icon={<GiTeacher />}
          description="Преподаватели университета"
          href="/lecturers"
        />
        <CardTable
          name="Students"
          icon={<PiStudent />}
          description="Студенты университета"
          href="/student"
        />
        <CardTable
          name="Exams"
          icon={<GrDocumentTest />}
          description="Экзамены университета"
          href="/exams"
        />
        <CardTable
          name="Statements"
          icon={<GrScorecard />}
          description="Ведомости университета"
          href="/statements"
        />
        <CardTable
          name="Marks"
          icon={<PiExam />}
          description="Оценки университета"
          href="/marks"
        />
      </div>
    </div>
  );
}
