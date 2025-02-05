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
import { getGroups } from "@/api/groupApi";
import FormSelect from "@/components/Form/FormSelect";
import GroupsPromise from "@/types/Group/GroupsPromise";
import FormDateOnly from "@/components/Form/FormDateOnly";
import StudentsPromise from "@/types/Student/StudentsPromise";
import StudentDTO from "@/types/Student/StudentDTO";
import { createStudent, deleteStudent, getFilteredStudents, getStudent, getStudents, updateStudent } from "@/api/studentApi";
import sortData from "@/functions/sortData";
import FilterSection from "@/components/FilterSection";
import StudentFilter from "@/types/Student/StudentFilter";


export default function StudentsPage() {
	let cachedGroups: string[] | null = null;
  const [students, setStudents] = useState<StudentsPromise>();
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
	const [page, setPage] = useState(1);
	
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");	

  const rowsPerPage = 5;
	let pages = 0;

	const filteredStudents = useMemo(() => {
  if (!searchQuery.trim()) return students?.$values || [];
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

  return students?.$values.filter((student) => matchesQuery(student)) || [];
}, [students, searchQuery]);

	const sortedStudents = useMemo(() => {
		if (!sortColumn) return filteredStudents;
		if (!students) return [];
    return sortData(filteredStudents, sortColumn as keyof typeof filteredStudents[0], sortDirection);
	}, [filteredStudents, sortColumn, sortDirection]);	

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedStudents.slice(start, end);
  }, [sortedStudents, page]);

  const [selectedItem, setSelectedItem] = useState<StudentDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: StudentDTO) => {
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
  } = useForm<StudentDTO>({ mode: "onChange", defaultValues: { firstname: "", surname: "", patronymic: "", birthdate: "", groupName: "" } });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
		reset: resetUpdate,
		watch: watchUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
	} = useForm<StudentDTO>({ mode: "onChange", defaultValues: { firstname: "", surname: "", patronymic: "", birthdate: "", groupName: "" } });
	
	const {
		register: registerFilter,
		handleSubmit: handleSubmitFilter,
		reset: resetFilter,
		watch: watchFilter,
		setValue: setValueFilter,
		formState: { errors: errorsFilter },
	} = useForm<StudentFilter>({ mode: "onChange", defaultValues: { course: "", groupName: "", dateStart: "", dateEnd: "" } });

  const [id, setId] = useState("");

  if (students) {
    pages = Math.ceil(sortedStudents.length / rowsPerPage);
  }

	const handleSubmitBtn = handleSubmitCreate(async (data) => {
		console.log("create", data);
    try {
      const response = await createStudent(data);
      console.log(response);
      if (response.success === true) {
        const data = await getStudents();
        setStudents(data);
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
      const response = await deleteStudent(id);
      console.log(response);
      if (response.success === true) {
        const data = await getStudents();
        setStudents(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

	const handleUpdate = handleSubmitUpdate(async (data: StudentDTO) => {
		console.log("update", id, data);

    try {
      const response = await updateStudent(id, data);
      console.log(response);
      if (response.success === true) {
        const data = await getStudents();
				setStudents(data);
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
    const fetchStudents = async () => {
      const data = await getStudents();
      setStudents(data);
    };
		fetchStudents();
  }, [setStudents]);

  if (!students) {
    return <LoadingSection />;
  }

	const columns = [
		{ key: "surname", label: "Last Name", sortable: true },
		{ key: "firstname", label: "First Name", sortable: true },
		{ key: "patronymic", label: "Patronymic", sortable: true },
		{ key: "birthdate", label: "Birthdate", sortable: true },
    { key: "groupName", label: "Group", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
	];

	
	const getGroupsData = async (): Promise<string[]> => {
		if (cachedGroups) {
			return cachedGroups;
		}

		const groups: string[] = [];
		const response: GroupsPromise = await getGroups();
		for (const group of response.$values) {
			groups.push(group.name);
		}
		cachedGroups = groups;
		return groups;
	}

			const handleSort = (key: string) => {
		if (sortColumn === key) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(key);
			setSortDirection("asc");
		}
			};
	
	const filterSubmit = handleSubmitFilter(async (data: StudentFilter) => {
		if (!dateValidation(data.dateStart ?? "", data.dateEnd ?? "")) {
			alert("Invalid date range");
			return;
		}
		console.log("filter", data);

		try {
			const response = await getFilteredStudents(data);
			console.log(response);
			setStudents(response);
		} catch (error) {
			alert((error as Error).message);
		}
	})

	const resetFilterBtn = async () => {
		resetFilter();

		try {
			const response = await getStudents();
			setStudents(response);
		} catch (error) {
			alert((error as Error).message);
		}
	}

	const dateValidation = (date1: string, date2: string) => {
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		if (d1 > d2) {
			return false;
		}
		return true;
	}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A878] via-[#007EA7] to-[#003459] text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white drop-shadow-md">
          Students
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
						<FilterSection onSubmit={filterSubmit} resetFilter={resetFilterBtn}>
							<FormInput
								name="course"
								label="Course"
								type="number"
								min={1}
								max={5}
								register={registerFilter}
								errors={errorsFilter}
							/>
							<FormSelect
								name="groupName"
								label="Group"
								data={getGroupsData()}
								register={registerFilter}
								errors={errorsFilter}
							/>
							<FormDateOnly
								name="dateStart"
								label="Date Start"
								register={registerFilter}
								errors={errorsFilter}
								setValue={setValueFilter}
							/>
							<FormDateOnly
								name="dateEnd"
								label="Date End"
								register={registerFilter}
								errors={errorsFilter}
								setValue={setValueFilter}
							/>
						</FilterSection>

            <ModalCreate
              reset={resetCreate}
              name="student"
              onSubmit={handleSubmitBtn}
              loading={false}
              error={null}
              setIsCreatedSuccess={setIsCreatedSuccess}
              isCreatedSuccess={isCreatedSuccess}
            >
              <FormInput
                name="firstname"
                register={registerCreate}
                errors={errorsCreate}
                maxLength={100}
                type="text"
                label="First Name"
							required
              />
              <FormInput
                name="surname"
                register={registerCreate}
                errors={errorsCreate}
                maxLength={100}
                type="text"
                label="Last Name"
							required
              />
              <FormInput
                name="patronymic"
                register={registerCreate}
                errors={errorsCreate}
                maxLength={100}
                type="text"
                label="Patronymic"
							required
              />
              <FormInput
                name="course"
                register={registerCreate}
                errors={errorsCreate}
                type="number"
                label="Course"
                min={1}
                max={5}
							required
              />
              <FormDateOnly
                name="birthdate"
                label="Birthdate"
                register={registerCreate}
                errors={errorsCreate}
                setValue={setValueCreate}
                required
              />
              <FormSelect
                label="Group"
                data={getGroupsData()}
                name="groupName"
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
            <TableBody items={items} emptyContent="No data">
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) =>
                    columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.id}
                          header="Student details"
                          fetchData={getStudent}
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
                          title="Delete student"
                          content="Delete student"
                          id={item.id}
                          handleDelete={handleDelete}
                        />
                      </TableCell>
                    ) : (
                      <TableCell className="py-3 px-2">
                        {getKeyValue(item, columnKey)}
                      </TableCell>
                    )
                  }
                </TableRow>
              )}
            </TableBody>
          </Table>

          <ModalUpdate
            name="student"
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
              name="firstname"
              register={registerUpdate}
              errors={errorsUpdate}
              maxLength={100}
              type="text"
              label="First Name"
							setValue={() => {
								setValueUpdate("firstname", selectedItem?.firstname || "");
							}}
                required
            />
            <FormInput
              name="surname"
              register={registerUpdate}
              errors={errorsUpdate}
              maxLength={100}
              type="text"
              label="Last Name"
              setValue={() => {
                setValueUpdate("surname", selectedItem?.surname || "");
              }}
                required
            />
            <FormInput
              name="patronymic"
              register={registerUpdate}
              errors={errorsUpdate}
              maxLength={100}
              type="text"
              label="Patronymic"
              setValue={() => {
                setValueUpdate("patronymic", selectedItem?.patronymic || "");
              }}
                required
            />
            <FormInput
              name="course"
              register={registerUpdate}
              errors={errorsUpdate}
              type="number"
              label="Course"
              min={1}
              max={5}
              setValue={() => {
                setValueUpdate("course", selectedItem?.course || 0);
              }}
                required
            />
            <FormDateOnly
              name="birthdate"
              label="Birthdate"
              register={registerUpdate}
              errors={errorsUpdate}
							setValue={setValueUpdate}
							value={selectedItem?.birthdate || ""}
                required
            />
            <FormSelect
              label="Group"
              data={getGroupsData()}
              name="groupName"
              register={registerUpdate}
              errors={errorsUpdate}
              defaultSelectedValue={selectedItem?.groupName}
              setValue={() =>
                setValueUpdate("groupName", selectedItem?.groupName || "ww")
              }
                required
            />
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
