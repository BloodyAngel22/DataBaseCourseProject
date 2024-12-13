"use client";

import ModalDetail from "@/components/ModalDetail";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  getKeyValue,
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
import { getGroups } from "@/api/groupApi";
import FormSelect from "@/components/FormSelect";
import GroupsPromise from "@/types/Group/GroupsPromise";
import FormDateOnly from "@/components/FormDateOnly";
import StudentsPromise from "@/types/Student/StudentsPromise";
import StudentDTO from "@/types/Student/StudentDTO";
import { createStudent, deleteStudent, getStudent, getStudents } from "@/api/studentApi";
import StatementsPromise from "@/types/Statement/StatementsPromise";
import StatementDTO from "@/types/Statement/StatementDTO";
import { createStatement, deleteStatement, getStatement, getStatements } from "@/api/statementApi";
import ExamDisciplinesPromise from "@/types/ExamDiscipline/ExamDisciplinesPromise";
import { getExamDiscipline, getExamDisciplines } from "@/api/examDisciplineApi";
import { i } from "framer-motion/client";

let cachedExamDisciplines: string[] | null = null;

export default function StatementsPage() {
	const [statements, setStatements] = useState<StatementsPromise>();
	const [examDisciplines, setExamDisciplines] = useState<ExamDisciplinesPromise>();
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  let pages = 0;
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return statements?.$values.slice(start, end);
  }, [statements, page]);

  const [selectedItem, setSelectedItem] = useState<StatementDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: StatementDTO) => {
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
  } = useForm<StatementDTO>({ mode: "onChange", defaultValues: { examDisciplineId: "", sessionYear: 0, dateIssued: "" } });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
		reset: resetUpdate,
		watch: watchUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<StatementDTO>({ mode: "onChange", defaultValues: { examDisciplineId: "", sessionYear: 0, dateIssued: "" } });

  const [id, setId] = useState("");

  if (statements) {
    pages = Math.ceil(statements.$values.length / rowsPerPage);
  }

	const handleSubmitBtn = handleSubmitCreate(async (data) => {
		const examDisciplineId = data.examDisciplineId;
		const { examDiscipline, date } = getExamDisciplineByNameDate(examDisciplineId);
		examDisciplines?.$values?.forEach((item) => {
			if (item.disciplineName === examDiscipline && item.eventDatetime === date) {
				data.examDisciplineId = item.id;
			}	
		})
		console.log("create", data);
	
    try {
      const response = await createStatement(data);
      console.log(response);
      if (response.success === true) {
        const data = await getStatements();
        setStatements(data);
        resetCreate();
        setIsCreatedSuccess(true);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteStatement(id);
      console.log(response);
      if (response.success === true) {
        const data = await getStatements();
        setStatements(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

	const handleUpdate = handleSubmitUpdate(async (data: StatementDTO) => {
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
    const fetchStatements = async () => {
      const data = await getStatements();
      setStatements(data);
    };
		fetchStatements();
	}, [setStatements]);
	
	useEffect(() => {
		const fetchExamDisciplines = async () => {
			const data = await getExamDisciplines();
			setExamDisciplines(data);
		};
		fetchExamDisciplines();
	}, [setExamDisciplines]);

  if (!statements || !examDisciplines) {
    return <LoadingSection />;
  }

	const columns = [
		{ key: "examDiscipline.disciplineName", label: "Discipline Name" },
		{ key: "examDiscipline.eventFormType", label: "Event Form Type" },
		{ key: "examDiscipline.eventDatetime", label: "Event Date Time" },
    { key: "sessionYear", label: "Session Year" },
    { key: "dateIssued", label: "Date Issued" },
    { key: "actions", label: "Actions" },
	];
	
	const getExamDisciplineByNameDate = (data: string): { examDiscipline: string; date: string } => {
		const examDiscipline = data.split("(")[0].trim();
		const date = data.split("(")[1].split(")")[0].trim();
		return { examDiscipline, date };
	}
	
	const getExamDisciplinesData = async (): Promise<string[]> => {
		if (cachedExamDisciplines) {
			return cachedExamDisciplines;
		}

		const examDisciplines: string[] = [];
		const response: ExamDisciplinesPromise = await getExamDisciplines();
		for (const examDiscipline of response.$values) {
			const value = `${examDiscipline.disciplineName} (${examDiscipline.eventDatetime})`;
			examDisciplines.push(value);
		}
		cachedExamDisciplines = examDisciplines;
		return examDisciplines;
	}

	const renderCell = (data : any, columnKey : string) => {
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
					Statements
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
            name="statement"
            onSubmit={handleSubmitBtn}
            loading={false}
            error={null}
            setIsCreatedSuccess={setIsCreatedSuccess}
            isCreatedSuccess={isCreatedSuccess}
          >
						<FormSelect
							label="Exam Discipline"
							data={(getExamDisciplinesData())}
							name="examDisciplineId"
							register={registerCreate}
							errors={errorsCreate}
						/>
						<FormInput
							name="sessionYear"
							register={registerCreate}
							errors={errorsCreate}
							label="Session Year"
							type="number"
							min={1900}
							max={2100}
						/>
						<FormDateOnly
							name="dateIssued"
							label="Date Issued"
							register={registerCreate}
							errors={errorsCreate}
							watch={watchCreate}
							setValue={setValueCreate}
							maxDate={new Date("2100-01-01")}
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
                <TableRow key={item.id}>
                  {(columnKey) =>
                    columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.id}
                          header="Statement details"
                          fetchData={getStatement}
												/>
												<Tooltip content="Update details">
                        <Button
                          isIconOnly
                          size="sm"
                          color="secondary"
													onPress={() => { openModal(item); setId(item.id); }}
                          variant="shadow"
                          className="scale-85"
                          startContent={<FiEdit3 className="text-lg" />}
													/>
												</Tooltip>

                        <ModalDelete
                          title="Delete statement"
                          content="Delete statement"
                          id={item.id}
                          handleDelete={handleDelete}
                        />
                      </TableCell>
                    ) : (
                      <TableCell className="py-3 px-2">
													{/* {getKeyValue(item, columnKey)} */}
													{renderCell(item, columnKey as string)}
                      </TableCell>
                    )
                  }
                </TableRow>
              )}
            </TableBody>
          </Table>

          <ModalUpdate
            name="statement"
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
							label="Exam Discipline"
							data={getExamDisciplinesData()}
							name="examDisciplineId"
							register={registerUpdate}
							errors={errorsUpdate}
							defaultSelectedValue={selectedItem?.examDisciplineId}
							setValue={() => setValueUpdate("examDisciplineId", selectedItem?.examDisciplineId || "")}
						/>
						<FormInput
							name="sessionYear"
							register={registerUpdate}
							errors={errorsUpdate}
							label="Session Year"
							type="number"
							min={1900}
							max={2100}
							setValue={() => setValueUpdate("sessionYear", selectedItem?.sessionYear || 0)}
						/>
						<FormDateOnly
							name="dateIssued"
							label="Date Issued"
							register={registerUpdate}
							errors={errorsUpdate}
							watch={watchUpdate}
							setValue={() => setValueUpdate("dateIssued", selectedItem?.dateIssued || "")}
							value={selectedItem?.dateIssued}
						/>
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
