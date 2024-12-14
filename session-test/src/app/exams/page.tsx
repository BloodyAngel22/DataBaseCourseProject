"use client";

import ModalDetail from "@/components/Modal/ModalDetail";
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
import LecturersPromise from "@/types/Lecturer/LecturersPromise";
import { getLecturers } from "@/api/lecturerApi";
import ExamDisciplinesPromise from "@/types/ExamDiscipline/ExamDisciplinesPromise";
import ExamDisciplineDTO from "@/types/ExamDiscipline/ExamDisciplineDTO";
import { createExamDiscipline, deleteExamDiscipline, getExamDiscipline, getExamDisciplines, getFilteredExamDisciplines } from "@/api/examDisciplineApi";
import FormDateTime from "@/components/Form/FormDateTime";
import CabinetsPromise from "@/types/Cabinet/CabinetsPromise";
import { getCabinets } from "@/api/cabinetApi";
import EventFormTypesPromise from "@/types/EventFormType/EventFormTypesPromise";
import { getEventFormTypes } from "@/api/EventFormTypeApi";
import DisciplinesPromise from "@/types/Discipline/DisciplinesPromise";
import { getDisciplines } from "@/api/disciplineApi";
import sortData from "@/functions/sortData";
import ExamDisciplineFilter from "@/types/ExamDiscipline/ExamDisciplineFilter";
import FilterSection from "@/components/FilterSection";

let cachedDisciplines: string[] | null = null;
let cachedLecturers: string[] | null = null;
let cachedCabinets: string[] | null = null;
let cachedEventFormTypes: string[] | null = null;

//FIXME: Сделать возможность изменения даты проведения экзамена
//FIXME: Поправить компонент 
export default function ExamsPage() {
	const [exams, setExams] = useState<ExamDisciplinesPromise>();
	const [lecturers, setLecturers] = useState<LecturersPromise>();
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
	const [page, setPage] = useState(1);
	
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");	

const filteredExams = useMemo(() => {
  if (!searchQuery.trim()) return exams?.$values || [];
  const lowerQuery = searchQuery.toLowerCase();

  const matchesQuery = (obj: any): boolean => {
    return Object.entries(obj).some(([key, value]) => {
      const normalizedKey = key.trim().toLowerCase();
      if (["id", "$id", "lecturerid", "disciplineid", "cabinetid", "eventformtypeid"].includes(normalizedKey)) {
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
  return exams?.$values.filter((exam) => matchesQuery(exam)) || [];
}, [exams, searchQuery]);

	const sortedExams = useMemo(() => {
		if (!sortColumn) return filteredExams;
		if (!exams) return [];
    return sortData(filteredExams, sortColumn as keyof typeof filteredExams[0], sortDirection);
	}, [filteredExams, sortColumn, sortDirection]);	

  const rowsPerPage = 5;
  let pages = 0;
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedExams.slice(start, end);
  }, [sortedExams, page]);

  const [selectedItem, setSelectedItem] = useState<ExamDisciplineDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: ExamDisciplineDTO) => {
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
  } = useForm<ExamDisciplineDTO>({ mode: "onChange", defaultValues: { disciplineName: "", eventDatetime: "", lecturerId: "", cabinetRoomName: "", eventFormType: "" } });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
		reset: resetUpdate,
		watch: watchUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
	} = useForm<ExamDisciplineDTO>({ mode: "onChange", defaultValues: { disciplineName: "", eventDatetime: "", lecturerId: "", cabinetRoomName: "", eventFormType: "" } });
	
	const {
		register: registerFilter,
		handleSubmit: handleSubmitFilter,
		reset: resetFilter,
		watch: watchFilter,
		setValue: setValueFilter,
		formState: { errors: errorsFilter },
	} = useForm<ExamDisciplineFilter>({ mode: "onChange", defaultValues: { dateStart: "", dateEnd: "", examType: "" } })

  const [id, setId] = useState("");

  if (exams) {
    pages = Math.ceil(sortedExams.length / rowsPerPage);
  }

	const handleSubmitBtn = handleSubmitCreate(async (data) => {
		const lecturerId = data.lecturerId;
		const surname = lecturerId.split(" ")[0];
		const firstname = lecturerId.split(" ")[1];
		const patronymic = lecturerId.split(" ")[2]; 

		const firstLecturerWithSameName = lecturers?.$values.find((lecturer) => lecturer.surname === surname && lecturer.firstname === firstname && lecturer.patronymic === patronymic);
		if (firstLecturerWithSameName) {
			data.lecturerId = firstLecturerWithSameName.id;
		}
		console.log("create", data);

    try {
      const response = await createExamDiscipline(data);
      console.log(response);
      if (response.success === true) {
				const data = await getExamDisciplines();
				data?.$values.forEach((item) => {
				item.lecturer.fio = `${item.lecturer.surname} ${item.lecturer.firstname} ${item.lecturer.patronymic}`;
			})
        setExams(data);
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
      const response = await deleteExamDiscipline(id);
      console.log(response);
      if (response.success === true) {
				const data = await getExamDisciplines();
				data?.$values.forEach((item) => {
				item.lecturer.fio = `${item.lecturer.surname} ${item.lecturer.firstname} ${item.lecturer.patronymic}`;
			})
        setExams(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

	const handleUpdate = handleSubmitUpdate(async (data: ExamDisciplineDTO) => {
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
    const fetchExams = async () => {
			const data = await getExamDisciplines();
			
			data?.$values.forEach((item) => {
				item.lecturer.fio = `${item.lecturer.surname} ${item.lecturer.firstname} ${item.lecturer.patronymic}`;
			})

      setExams(data);
    };
		fetchExams();
	}, [setExams]);
	
	useEffect(() => {
		const fetchLecturers = async () => {
			const data = await getLecturers();
			setLecturers(data);
		};
		fetchLecturers();
	}, [setLecturers]);

  if (!exams || !lecturers) {
    return <LoadingSection />;
  }

	const columns = [
		{ key: "disciplineName", label: "Discipline", sortable: true },
		{ key: "eventDatetime", label: "Date", sortable: true },
		{ key: "lecturer.fio", label: "Lecturer", sortable: true },
		{ key: "cabinetRoomName", label: "Room", sortable: true },
		{ key: "eventFormType", label: "Type", sortable: true },
		{ key: "actions", label: "Actions", sortable: false },
	];

	const getLecturersData = async (): Promise<string[]> => {
		if (cachedLecturers) {
			return cachedLecturers;
		}

		const lecturers: string[] = [];
		const response: LecturersPromise = await getLecturers();
		for (const lecturer of response.$values) {
			const lecturerFIO = `${lecturer.surname} ${lecturer.firstname} ${lecturer.patronymic}`;
			lecturers.push(lecturerFIO);
		}
		cachedLecturers = lecturers;
		return lecturers;
	}

	const getDisciplinesData = async (): Promise<string[]> => {
		if (cachedDisciplines) {
			return cachedDisciplines;
		}

		const disciplines: string[] = [];
		const response: DisciplinesPromise = await getDisciplines();
		for (const discipline of response.$values) {
			disciplines.push(discipline.name);
		}
		cachedDisciplines = disciplines;
		return disciplines;
	}

	const getCabinetsData = async (): Promise<string[]> => {
		if (cachedCabinets) {
			return cachedCabinets;
		}

		const cabinets: string[] = [];
		const response: CabinetsPromise = await getCabinets();
		for (const cabinet of response.$values) {
			cabinets.push(cabinet.roomName);
		}
		cachedCabinets = cabinets;
		return cabinets;
	}

	const getEventFormTypesData = async (): Promise<string[]> => {
		if (cachedEventFormTypes) {
			return cachedEventFormTypes;
		}

		const eventFormTypes: string[] = [];
		const response: EventFormTypesPromise = await getEventFormTypes();
		for (const eventFormType of response.$values) {
			eventFormTypes.push(eventFormType.type);
		}
		cachedEventFormTypes = eventFormTypes;
		return eventFormTypes;
	}

	const getFIOLecturerById = (id: string) => {
		if (!lecturers) {
			return "Unknown";
		}
		const lecturer = lecturers?.$values.find((lecturer) => lecturer.id === id);
		return lecturer ? `${lecturer?.surname} ${lecturer?.firstname} ${lecturer?.patronymic}` : "Unknown";
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

	const onSubmitFilter = handleSubmitFilter(async (data) => {
		console.log(data);

		try {
			const response = await getFilteredExamDisciplines(data);
			setExams(response);
			response?.$values.forEach((item) => {
				item.lecturer.fio = `${item.lecturer.surname} ${item.lecturer.firstname} ${item.lecturer.patronymic}`;
			})
		} catch (error) {
			alert((error as Error).message);
		}
	});

	const resetFilterBtn = async () => {
		resetFilter();

		try {
			const data = await getExamDisciplines();
			data?.$values.forEach((item) => {
				item.lecturer.fio = `${item.lecturer.surname} ${item.lecturer.firstname} ${item.lecturer.patronymic}`;
			})
			setExams(data);
		} catch (error) {
			alert((error as Error).message);
		}
	}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white drop-shadow-md">
          Exams
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

					<div className="flex gap-2">
						<FilterSection
							onSubmit={onSubmitFilter}
							resetFilter={resetFilterBtn}
						>
							<FormSelect
								label="Exam Type"
								data={getEventFormTypesData()}
								name="examType"
								register={registerFilter}
								errors={errorsFilter}
							/>
							<FormDateTime
								name="dateStart"
								register={registerFilter}
								errors={errorsFilter}
								watch={watchFilter}
								setValue={setValueFilter}
								label="Start date"
								maxDate={new Date("2030-01-01")}
							/>
							<FormDateTime
								name="dateEnd"
								register={registerFilter}
								errors={errorsFilter}
								watch={watchFilter}
								setValue={setValueFilter}
								label="End date"
								maxDate={new Date("2030-01-01")}
							/>
						</FilterSection>						

            <ModalCreate
              reset={resetCreate}
              name="exam"
              onSubmit={handleSubmitBtn}
              loading={false}
              error={null}
              setIsCreatedSuccess={setIsCreatedSuccess}
              isCreatedSuccess={isCreatedSuccess}
            >
              <FormSelect
                label="Discipline"
                data={getDisciplinesData()}
                name="disciplineName"
                register={registerCreate}
                errors={errorsCreate}
                required
              />
              <FormDateTime
                name="eventDateTime"
                register={registerCreate}
                errors={errorsCreate}
                watch={watchCreate}
                setValue={setValueCreate}
                maxDate={new Date("2030-01-01")}
                label="Event date and time"
                required
              />
              <FormSelect
                label="Lecturer"
                data={getLecturersData()}
                name="lecturerId"
                register={registerCreate}
                errors={errorsCreate}
                required
              />
              <FormSelect
                label="Room"
                data={getCabinetsData()}
                name="cabinetRoomName"
                register={registerCreate}
                errors={errorsCreate}
                required
              />
              <FormSelect
                label="Type"
                data={getEventFormTypesData()}
                name="eventFormType"
                register={registerCreate}
                errors={errorsCreate}
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
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) =>
                    columnKey === "lecturerId" ? (
                      <TableCell className="py-3 px-2">
                        {getFIOLecturerById(item.lecturerId)}
                      </TableCell>
                    ) : columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.id}
                          header="Exam details"
                          fetchData={getExamDiscipline}
                        />
                        <Tooltip content="Update details">
                          <Button
                            isIconOnly
                            size="sm"
                            color="secondary"
                            onPress={() => {
                              openModal(item);
                              setId(item.id);
                            }}
                            variant="shadow"
                            className="scale-85"
                            startContent={<FiEdit3 className="text-lg" />}
                          />
                        </Tooltip>

                        <ModalDelete
                          title="Delete exam"
                          content="Delete exam"
                          id={item.id}
                          handleDelete={handleDelete}
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
            name="exam"
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
            <FormInput
              name="disciplineName"
              register={registerUpdate}
              errors={errorsUpdate}
              maxLength={100}
              type="text"
              label="Discipline Name"
              setValue={() => {
                setValueUpdate(
                  "disciplineName",
                  selectedItem?.disciplineName || ""
                );
              }}
              required
            />
            <FormDateTime
              name="eventDatetime"
              register={registerUpdate}
              errors={errorsUpdate}
              watch={watchUpdate}
              setValue={() =>
                setValueUpdate(
                  "eventDatetime",
                  selectedItem?.eventDatetime || ""
                )
              }
              value={selectedItem?.eventDatetime}
              required
            />
            <FormSelect
              label="Lecturer"
              data={getLecturersData()}
              name="lecturerId"
              register={registerUpdate}
              errors={errorsUpdate}
              defaultSelectedValue={selectedItem?.lecturerId}
              setValue={() =>
                setValueUpdate("lecturerId", selectedItem?.lecturerId || "")
              }
              required
            />
            {/* //TODO: добавить cabinet и event_form_type */}
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
