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
import FormInput from "@/components/Form/FormInput";
import ModalDelete from "@/components/Modal/ModalDelete";
import { TiArrowBackOutline, TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import LoadingSection from "@/components/LoadingSection";
import ModalUpdate from "@/components/Modal/ModalUpdate";
import { FiEdit3 } from "react-icons/fi";
import FormSelect from "@/components/Form/FormSelect";
import FormDateOnly from "@/components/Form/FormDateOnly";
import StatementsPromise from "@/types/Statement/StatementsPromise";
import StatementDTO from "@/types/Statement/StatementDTO";
import { createStatement, deleteStatement, getFilteredStatements, getStatement, getStatements, updateStatement } from "@/api/statementApi";
import ExamDisciplinesPromise from "@/types/ExamDiscipline/ExamDisciplinesPromise";
import { getExamDisciplines } from "@/api/examDisciplineApi";
import sortData from "@/functions/sortData";
import StatementFilter from "@/types/Statement/StatementFilter";
import FilterSection from "@/components/FilterSection";
import FormDateTime from "@/components/Form/FormDateTime";
import FormSelectFK from "@/components/Form/FormSelectFK";


export default function StatementsPage() {
	let cachedExamDisciplines: {id: string; label: string}[] | null = null;
	const [statements, setStatements] = useState<StatementsPromise>();
	const [examDisciplines, setExamDisciplines] = useState<ExamDisciplinesPromise>();
	const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
	const [page, setPage] = useState(1);

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");	

  const rowsPerPage = 5;
	let pages = 0;

			const filteredStatements = useMemo(() => {
  if (!searchQuery.trim()) return statements?.$values || [];
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

  return statements?.$values.filter((statement) => matchesQuery(statement)) || [];
}, [statements, searchQuery]);

	const sortedStatements = useMemo(() => {
		if (!sortColumn) return filteredStatements;
		if (!statements) return [];
    return sortData(filteredStatements, sortColumn as keyof typeof filteredStatements[0], sortDirection);
	}, [filteredStatements, sortColumn, sortDirection]);	

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedStatements.slice(start, end);
  }, [sortedStatements, page]);

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
	
	const {
		register: registerFilter,
		handleSubmit: handleSubmitFilter,
		reset: resetFilter,
		watch: watchFilter,
		setValue: setValueFilter,
		formState: { errors: errorsFilter },
	} = useForm<StatementFilter>({ mode: "onChange", defaultValues: { eventDatetimeStart: "", eventDatetimeEnd: "", sessionYear: "", dateIssuedStart: "", dateIssuedEnd: "" } });

  const [id, setId] = useState("");

  if (statements) {
    pages = Math.ceil(sortedStatements.length / rowsPerPage);
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
		const examDisciplineId = data.examDisciplineId;
		const { examDiscipline, date } = getExamDisciplineByNameDate(examDisciplineId);
		examDisciplines?.$values?.forEach((item) => {
			if (item.disciplineName === examDiscipline && item.eventDatetime === date) {
				data.examDisciplineId = item.id;
			}	
		})
		console.log("update", id, data);

    try {
      const response = await updateStatement(id, data);
      console.log(response);
      if (response.success === true) {
        const data = await getStatements();
				setStatements(data);
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
		{ key: "examDiscipline.disciplineName", label: "Discipline Name", sortable: true },
		{ key: "examDiscipline.eventFormType", label: "Event Form Type", sortable: true },
		{ key: "examDiscipline.eventDatetime", label: "Event Date Time", sortable: true },
    { key: "sessionYear", label: "Session Year", sortable: true },
    { key: "dateIssued", label: "Date Issued", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
	];
	
	const getExamDisciplineByNameDate = (data: string): { examDiscipline: string; date: string } => {
		const examDiscipline = data.split("(")[0].trim();
		const date = data.split("(")[1].split(")")[0].trim();
		return { examDiscipline, date };
	}
	
	const getExamDisciplinesData = async (): Promise<{id: string; label: string}[]> => {
		if (cachedExamDisciplines) {
			return cachedExamDisciplines;
		}

		const examDisciplines: {id: string; label: string}[] = [];
		const response: ExamDisciplinesPromise = await getExamDisciplines();
		for (const examDiscipline of response.$values) {
			const value = `${examDiscipline.disciplineName} (${examDiscipline.eventDatetime})`;
			examDisciplines.push({id: examDiscipline.id, label: value});
		}
		cachedExamDisciplines = examDisciplines;
		return examDisciplines;
	}

	const getExamDisciplineDataById = (id: string): string => {
		const examDiscipline = examDisciplines.$values.find((item) => item.id === id);
		return `${examDiscipline?.disciplineName} (${examDiscipline?.eventDatetime})`;
	}

	const renderCell = (data : any, columnKey : string) => {
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
	
	const handleFilter = handleSubmitFilter(async (data: StatementFilter) => {
		console.log("filter", data);
		try {
			const response = await getFilteredStatements(data);
			setStatements(response);
		} catch (error) {
			alert((error as Error).message);
		}
	})

	const resetFilterBtn = async () => {
		resetFilter();

		try {
			const response = await getStatements();
			setStatements(response);
		} catch (error) {
			alert((error as Error).message);
		}
	}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A878] via-[#007EA7] to-[#003459] text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white drop-shadow-md">
          Statements
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

					<div className="flex gap-2">
						<FilterSection
							onSubmit={handleFilter}
							resetFilter={resetFilterBtn}
						>
							<FormInput
								name="sessionYear"
								register={registerFilter}
								errors={errorsFilter}
								label="Session Year"
								type="number"
								min={1900}
								max={2030}
							/>
							<FormDateTime
								name="eventDatetimeStart"
								register={registerFilter}
								errors={errorsFilter}
								label="Event Date Time Start"
								setValue={setValueFilter}
								maxDate={new Date("2030-01-01")}
							/>
							<FormDateTime
								name="eventDatetimeEnd"
								register={registerFilter}
								errors={errorsFilter}
								label="Event Date Time End"
								setValue={setValueFilter}
								maxDate={new Date("2030-01-01")}
							/>
							<FormDateOnly
								name="dateIssuedStart"
								label="Date Issued Start"
								register={registerFilter}
								errors={errorsFilter}
								setValue={setValueFilter}
								maxDate={new Date("2030-01-01")}
							/>
							<FormDateOnly
								name="dateIssuedEnd"
								label="Date Issued End"
								register={registerFilter}
								errors={errorsFilter}
								setValue={setValueFilter}
								maxDate={new Date("2030-01-01")}
							/>
						</FilterSection>

            <ModalCreate
              reset={resetCreate}
              name="statement"
              onSubmit={handleSubmitBtn}
              loading={false}
              error={null}
              setIsCreatedSuccess={setIsCreatedSuccess}
              isCreatedSuccess={isCreatedSuccess}
            >
              <FormSelectFK
                label="Exam Discipline"
                data={getExamDisciplinesData()}
                name="examDisciplineId"
                register={registerCreate}
                errors={errorsCreate}
								setValue={(value) => setValueCreate("examDisciplineId", value)}
                required
              />
              <FormInput
                name="sessionYear"
                register={registerCreate}
                errors={errorsCreate}
                label="Session Year"
                type="number"
                min={1900}
                max={2100}
                required
              />
              <FormDateOnly
                name="dateIssued"
                label="Date Issued"
                register={registerCreate}
                errors={errorsCreate}
                setValue={setValueCreate}
                maxDate={new Date("2100-01-01")}
                required
              />
            </ModalCreate>
          </div>
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
            <TableBody items={items} emptyContent={"No data"}>
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
                            onPress={async () => {
                              openModal(item);
															setId(item.id);
															
															setValueUpdate("dateIssued", item.dateIssued);

															setSelectedItem({
																...item,
																examDisciplineId: getExamDisciplineDataById(item.examDisciplineId)
															})
                            }}
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
            <FormSelectFK
              label="Exam Discipline"
              data={getExamDisciplinesData()}
              name="examDisciplineId"
              register={registerUpdate}
              errors={errorsUpdate}
              defaultSelectedValue={selectedItem?.examDisciplineId}
              setValue={(value) =>
                setValueUpdate("examDisciplineId", value || "")
              }
              required
            />
            <FormInput
              name="sessionYear"
              register={registerUpdate}
              errors={errorsUpdate}
              label="Session Year"
              type="number"
              min={1900}
              max={2100}
              setValue={() =>
                setValueUpdate("sessionYear", selectedItem?.sessionYear || 0)
              }
              required
            />
            <FormDateOnly
              name="dateIssued"
              label="Date Issued"
              register={registerUpdate}
              errors={errorsUpdate}
              setValue={setValueUpdate}
              value={selectedItem?.dateIssued}
              maxDate={new Date("2100-01-01T00:00:00.000Z")}
              required
            />
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
