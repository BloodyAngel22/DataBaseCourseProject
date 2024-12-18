"use client";

import ModalDetail from "@/components/Modal/ModalDetail";
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
	Input,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ModalCreate from "@/components/Modal/ModalCreate";
import { useForm } from "react-hook-form";
import ModalDelete from "@/components/Modal/ModalDelete";
import { TiArrowBackOutline, TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import LoadingSection from "@/components/LoadingSection";
import ModalUpdate from "@/components/Modal/ModalUpdate";
import { FiEdit3 } from "react-icons/fi";
import FormSelect from "@/components/Form/FormSelect";
import StatementsPromise from "@/types/Statement/StatementsPromise";
import {
  getStatements,
} from "@/api/statementApi";
import MarksPromise from "@/types/Mark/MarksPromise";
import StudentsPromise from "@/types/Student/StudentsPromise";
import MarkDTO from "@/types/Mark/MarkDTO";
import { createMark, deleteMark, getMark, getMarks, updateMark } from "@/api/markApi";
import { getStudents } from "@/api/studentApi";
import sortData from "@/functions/sortData";


export default function MarksPage() {
	let cachedStatements: string[] | null = null;
	let cachedStudents: string[] | null = null;
  const [marks, setMarks] = useState<MarksPromise>();
  const [statements, setStatements] =
		useState<StatementsPromise>();
	const [students, setStudents] = useState<StudentsPromise>();

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");	

  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
	let pages = 0;

				const filteredMarks = useMemo(() => {
  if (!searchQuery.trim()) return marks?.$values || [];
  const lowerQuery = searchQuery.toLowerCase();

  const matchesQuery = (obj: any): boolean => {
    return Object.entries(obj).some(([key, value]) => {
      const normalizedKey = key.trim().toLowerCase();
      if (["id", "$id", "lecturerid", "disciplineid", "cabinetid", "eventformtypeid", "examdisciplineid"].includes(normalizedKey)) {
        return false;
      }
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowerQuery);
      }
      if (typeof value === "object" && value !== null) {
        return matchesQuery(value);
      }
      return false;
    });
  };

  return marks?.$values.filter((mark) => matchesQuery(mark)) || [];
}, [marks, searchQuery]);

	const sortedMarks = useMemo(() => {
		if (!sortColumn) return filteredMarks;
		if (!marks) return [];
    return sortData(filteredMarks, sortColumn as keyof typeof filteredMarks[0], sortDirection);
	}, [filteredMarks, sortColumn, sortDirection]);	

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedMarks.slice(start, end);
  }, [sortedMarks, page]);

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
    pages = Math.ceil(sortedMarks.length / rowsPerPage);
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
				data?.$values.forEach((item) => {
				item.student.fio = `${item.student.surname} ${item.student.firstname} ${item.student.patronymic}`;
			})
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
				data?.$values.forEach((item) => {
				item.student.fio = `${item.student.surname} ${item.student.firstname} ${item.student.patronymic}`;
			})
        setMarks(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

	const handleUpdate = handleSubmitUpdate(async (data: MarkDTO) => {
    const { firstname, surname, patronymic } = getStudentByName(data.studentId);
    students?.$values?.forEach((item) => {
      if (
        item.firstname === firstname &&
        item.surname === surname &&
        item.patronymic === patronymic
      ) {
        data.studentId = item.id;
      }
    });

    const { examDiscipline, date } = getExamDisciplineByNameDate(
      data.statementId
    );
    statements?.$values?.forEach((item) => {
      if (
        item.examDiscipline.disciplineName === examDiscipline &&
        item.examDiscipline.eventDatetime === date
      ) {
        data.statementId = item.id;
      }
    });
    console.log("update", id, id2, data);

    try {
      const response = await updateMark(id, id2, data);
      console.log(response);
      if (response.success === true) {
				const data = await getMarks();
				data?.$values.forEach((item) => {
          item.student.fio = `${item.student.surname} ${item.student.firstname} ${item.student.patronymic}`;
        });
        setMarks(data);
        setIsModalOpen(false);
        setSelectedItem(null);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  });

  useEffect(() => {
    const fetchMarks = async () => {
			const data = await getMarks();
			
			data?.$values.forEach((item) => {
				item.student.fio = `${item.student.surname} ${item.student.firstname} ${item.student.patronymic}`;
			})

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
		{ key: "mark1", label: "Mark", sortable: true },
		{ key: "student.fio", label: "FIO", sortable: true },
		{ key: "statement.sessionYear", label: "Session Year", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
	];
	
	const getStudentByName = (data: string): { firstname: string; surname: string; patronymic: string }=> {
		const firstname = data.split(" ")[1];
		const surname = data.split(" ")[0];
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

	const getStatementById = (id: string) => {
		if (!statements) {
			return "Unknown";
		}
		const statement = statements?.$values.find((statement) => statement.id === id);
		return statement ? `${statement?.examDiscipline.disciplineName} (${statement?.examDiscipline.eventDatetime})` : "Unknown";
	}

  const renderCell = (data: any, columnKey: string) => {
    if (columnKey.includes(".")) {
      const keys = columnKey.split(".");
      return keys.reduce((acc, key) => acc?.[key], data) || "N/A";
    }
    return data[columnKey] || "N/A";
	};
	
	
			const handleSort = (key: string) => {
		if (sortColumn === key) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(key);
			setSortDirection("asc");
		}
	};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A878] via-[#007EA7] to-[#003459] text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white drop-shadow-md">
          Marks
        </h1>

        <div className="flex justify-between items-center mb-6">
          <Button
            as={Link}
            href="/authenticated"
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
							required
            />
            <FormSelect
              label="Student"
              data={getStudentsData()}
              name="studentId"
              register={registerCreate}
              errors={errorsCreate}
							required
            />
            <FormSelect
              label="Statement"
              data={getStatementsData()}
              name="statementId"
              register={registerCreate}
              errors={errorsCreate}
							required
            />
          </ModalCreate>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Input
            type="text"
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    <span>{column.label}</span>
                    <span className="scale-125">
                      {column.sortable && sortColumn === column.key ? (
                        sortDirection === "asc" ? (
                          <TiArrowDownThick />
                        ) : (
                          <TiArrowUpThick />
                        )
                      ) : null}
                    </span>
                  </div>
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No data"} items={items}>
              {(item) => (
                <TableRow key={item.$id}>
                  {(columnKey) =>
                    columnKey === "studentId" ? (
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

															setSelectedItem({
																...item,
																studentId: getFIOStudentById(item.studentId),
																statementId: getStatementById(item.statementId),
															});
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
              register={registerUpdate}
              errors={errorsUpdate}
              setValue={() => {
                setValueUpdate("mark1", selectedItem?.mark1 || "");
							}}
							defaultSelectedValue={selectedItem?.mark1}
							required
            />
            <FormSelect
              label="Student"
              data={getStudentsData()}
              name="studentId"
              register={registerUpdate}
              errors={errorsUpdate}
              setValue={() => {
                setValueUpdate("studentId", selectedItem?.studentId || "");
							}}
							defaultSelectedValue={selectedItem?.studentId}
							required
            />
            <FormSelect
              label="Statement"
              data={getStatementsData()}
              name="statementId"
              register={registerUpdate}
              errors={errorsUpdate}
              setValue={() => {
                setValueUpdate("statementId", selectedItem?.statementId || "");
							}}
							defaultSelectedValue={selectedItem?.statementId}
							required
            />
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
