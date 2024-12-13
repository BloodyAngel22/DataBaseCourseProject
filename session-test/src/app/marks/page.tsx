"use client";

import ModalDetail from "@/components/ModalDetail";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Pagination,
  Tooltip,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ModalCreate from "@/components/ModalCreate";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import ModalDelete from "@/components/ModalDelete";
import { TiArrowBackOutline } from "react-icons/ti";
import LoadingSection from "@/components/LoadingSection";
import ModalUpdate from "@/components/ModalUpdate";
import { FiEdit3 } from "react-icons/fi";
import FormSelect from "@/components/FormSelect";
import FormDateOnly from "@/components/FormDateOnly";
import StatementsPromise from "@/types/Statement/StatementsPromise";
import StatementDTO from "@/types/Statement/StatementDTO";
import {
  createStatement,
  deleteStatement,
  getStatement,
  getStatements,
} from "@/api/statementApi";
import ExamDisciplinesPromise from "@/types/ExamDiscipline/ExamDisciplinesPromise";
import { getExamDisciplines } from "@/api/examDisciplineApi";
import MarksPromise from "@/types/Mark/MarksPromise";
import StudentsPromise from "@/types/Student/StudentsPromise";
import MarkDTO from "@/types/Mark/MarkDTO";
import { createMark, deleteMark, getMark, getMarks } from "@/api/markApi";
import { getStudents } from "@/api/studentApi";

let cachedStatements: string[] | null = null;
let cachedStudents: string[] | null = null;

export default function MarksPage() {
  const [marks, setMarks] = useState<MarksPromise>();
  const [statements, setStatements] =
		useState<StatementsPromise>();
	const [students, setStudents] = useState<StudentsPromise>();

  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  let pages = 0;
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return marks?.$values.slice(start, end);
  }, [marks, page]);

  const [selectedItem, setSelectedItem] = useState<MarkDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: MarkDTO) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    watch: watchCreate,
    setValue: setValueCreate,
    formState: { errors: errorsCreate },
  } = useForm<MarkDTO>({
    mode: "onChange",
    defaultValues: { mark1: "", studentId: "", statementId: "" },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    watch: watchUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<MarkDTO>({
    mode: "onChange",
    defaultValues: { mark1: "", studentId: "", statementId: "" },
  });

	const [id, setId] = useState("");
	const [id2, setId2] = useState("");

  if (marks) {
    pages = Math.ceil(marks.$values.length / rowsPerPage);
  }

  const handleSubmitBtn = handleSubmitCreate(async (data) => {
		const { firstname, surname, patronymic } = getStudentByName(data.studentId);
		students?.$values?.forEach((item) => {
			if (
				item.firstname === firstname &&
				item.surname === surname &&
				item.patronymic === patronymic
			) {
				data.studentId = item.id;
			}
		})

		const { examDiscipline, date } = getExamDisciplineByNameDate(data.statementId);
		statements?.$values?.forEach((item) => {
			if (
				item.examDiscipline.disciplineName === examDiscipline &&
				item.examDiscipline.eventDatetime === date
			) {
				data.statementId = item.id;
			}
		})

    console.log("create", data);

    try {
      const response = await createMark(data);
      console.log(response);
      if (response.success === true) {
        const data = await getMarks();
        setMarks(data);
        resetCreate();
        setIsCreatedSuccess(true);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  });

	const handleDelete = async (studentId: string, statementId: string) => {
		console.log("delete", studentId, statementId);
    try {
      const response = await deleteMark(studentId, statementId);
      console.log(response);
      if (response.success === true) {
        const data = await getMarks();
        setMarks(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleUpdate = handleSubmitUpdate(async (data: MarkDTO) => {
    console.log("update", id, data);

    // try {
    //   const response = await updateLecturer(id, data);
    //   console.log(response);
    //   if (response.success === true) {
    //     const data = await getLecturers();
    // 		setLecturers(data);
    // 		setIsModalOpen(false);
    // 		setSelectedItem(null);
    //   } else {
    //     alert(response.message);
    //   }
    // } catch (error) {
    //   alert((error as Error).message);
    // }
  });

  useEffect(() => {
    const fetchMarks = async () => {
      const data = await getMarks();
      setMarks(data);
    };
    fetchMarks();
  }, [setMarks]);

  useEffect(() => {
    const fetchStatements = async () => {
      const data = await getStatements();
      setStatements(data);
    };
    fetchStatements();
	}, [setStatements]);
	
	useEffect(() => {
		const fetchStudents = async () => {
			const data = await getStudents();
			setStudents(data);
		};
		fetchStudents();
	}, [setStudents]);

  if (!marks || !statements || !students) {
    return <LoadingSection />;
  }

  const columns = [
		{ key: "mark1", label: "Mark" },
		{ key: "studentName", label: "FIO" },
		{ key: "statement.sessionYear", label: "Session Year" },
    { key: "actions", label: "Actions" },
	];
	
	const getStudentByName = (data: string): { firstname: string; surname: string; patronymic: string }=> {
		const firstname = data.split(" ")[0];
		const surname = data.split(" ")[1];
		const patronymic = data.split(" ")[2];
		return { firstname, surname, patronymic };
	}

  const getExamDisciplineByNameDate = (
    data: string
  ): { examDiscipline: string; date: string } => {
    const examDiscipline = data.split("(")[0].trim();
    const date = data.split("(")[1].split(")")[0].trim();
    return { examDiscipline, date };
  };

  const getStatementsData = async (): Promise<string[]> => {
    if (cachedStatements) {
      return cachedStatements;
    }

    const statements: string[] = [];
    const response: StatementsPromise = await getStatements();
    for (const statement of response.$values) {
      const value = `${statement.examDiscipline.disciplineName} (${statement.examDiscipline.eventDatetime})`;
      statements.push(value);
    }
    cachedStatements = statements;
    return statements;
	};
	
	const getStudentsData = async (): Promise<string[]> => {
		if (cachedStudents) {
			return cachedStudents;
		}
		
		const students: string[] = [];
		const response: StudentsPromise = await getStudents();
		for (const student of response.$values) {
			const value = `${student.surname} ${student.firstname} ${student.patronymic}`;
			students.push(value);
		}
		cachedStudents = students;
		return students;
	}

	const getMarksData = (): string[] => {
		const marks = ["отлично", "хорошо", "удовлетворительно", "неудовлетворительно", "зачет", "не зачтено"];

		return marks;
	}

	const getFIOStudentById = (id: string) => {
		if (!students) {
			return "Unknown";
		}
		const student = students?.$values.find((student) => student.id === id);
		return student ? `${student?.surname} ${student?.firstname} ${student?.patronymic}` : "Unknown";
	}

  const renderCell = (data: any, columnKey: string) => {
    if (columnKey.includes(".")) {
      const keys = columnKey.split(".");
      return keys.reduce((acc, key) => acc?.[key], data) || "N/A";
    }
    return data[columnKey] || "N/A";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white drop-shadow-md">
          Marks
        </h1>

        <div className="flex justify-between items-center mb-6">
          <Button
            as={Link}
            href="/"
            color="primary"
            size="sm"
            startContent={<TiArrowBackOutline />}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md shadow-lg transition-transform transform hover:scale-105"
          >
            Go to home
          </Button>
          <ModalCreate
            reset={resetCreate}
            name="mark"
            onSubmit={handleSubmitBtn}
            loading={false}
            error={null}
            setIsCreatedSuccess={setIsCreatedSuccess}
            isCreatedSuccess={isCreatedSuccess}
          >
            <FormSelect
              label="Mark"
              data={getMarksData()}
              name="mark1"
              register={registerCreate}
              errors={errorsCreate}
            />
            <FormSelect
              label="Student"
              data={getStudentsData()}
              name="studentId"
              register={registerCreate}
              errors={errorsCreate}
            />
            <FormSelect
              label="Statement"
              data={getStatementsData()}
              name="statementId"
              register={registerCreate}
              errors={errorsCreate}
            />
          </ModalCreate>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table
            aria-label="Example table with custom cells"
            isStriped
            className="text-black table-auto w-full border-collapse rounded-lg overflow-hidden"
            bottomContent={
              <div className="flex justify-between items-center p-4 bg-gray-100">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                  className="bg-gray-200 p-2 rounded-lg shadow-sm"
                />
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className="font-bold text-indigo-600 bg-gray-50 py-4 px-2 border-b border-gray-200"
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.$id}>
                  {(columnKey) =>
                    columnKey === "studentName" ? (
                      <TableCell className="py-3 px-2">
                        {getFIOStudentById(item.studentId)}
                      </TableCell>
                    ) : columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.studentId}
                          id2={item.statementId}
                          header="Mark details"
                          fetchData2={getMark}
                        />
                        <Tooltip content="Update details">
                          <Button
                            isIconOnly
                            size="sm"
                            color="secondary"
                            onPress={() => {
                              openModal(item);
                              setId(item.studentId);
                              setId2(item.statementId);
                            }}
                            variant="shadow"
                            className="scale-85"
                            startContent={<FiEdit3 className="text-lg" />}
                          />
                        </Tooltip>

                        <ModalDelete
                          title="Delete mark"
                          content="Delete mark"
                          id={item.studentId}
                          id2={item.statementId}
                          handleDelete2={handleDelete}
                        />
                      </TableCell>
                    ) : (
                      <TableCell className="py-3 px-2">
                        {renderCell(item, columnKey as string)}
                      </TableCell>
                    )
                  }
                </TableRow>
              )}
            </TableBody>
          </Table>

          <ModalUpdate
            name="mark"
            reset={resetUpdate}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              resetUpdate();
            }}
            onSubmit={handleUpdate}
            isUpdatedSuccess={isCreatedSuccess}
            setIsUpdatedSuccess={setIsCreatedSuccess}
          >
            <FormSelect
              label="Mark"
              data={getMarksData()}
              name="mark1"
              register={registerCreate}
							errors={errorsCreate}
							setValue={() => { setValueUpdate("mark1", selectedItem?.mark1 || ""); }}
            />
            <FormSelect
              label="Student"
              data={getStudentsData()}
              name="studentId"
              register={registerCreate}
							errors={errorsCreate}
							setValue={() => { setValueUpdate("studentId", selectedItem?.studentId || ""); }}
            />
            <FormSelect
              label="Statement"
              data={getStatementsData()}
              name="statementId"
              register={registerCreate}
							errors={errorsCreate}
							setValue={() => { setValueUpdate("statementId", selectedItem?.statementId || ""); }}
            />
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
