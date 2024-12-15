"use client";

import {
  getDepartments,
} from "@/api/departmentApi";
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
import DepartmentsPromise from "@/types/Department/DepartmentsPromise";
import LecturersPromise from "@/types/Lecturer/LecturersPromise";
import LecturerDTO from "@/types/Lecturer/LecturerDTO";
import { createLecturer, deleteLecturer, getLecturer, getLecturers } from "@/api/lecturerApi";
import FormDateOnly from "@/components/Form/FormDateOnly";
import sortData from "@/functions/sortData";

let cachedDepartments: string[] | null = null;

//FIXME: Сделать возможность изменения даты рождения лектора
export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<LecturersPromise>();
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
	const [page, setPage] = useState(1);
	
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");	

  const rowsPerPage = 5;
	let pages = 0;

		const filteredLecturers = useMemo(() => {
  if (!searchQuery.trim()) return lecturers?.$values || [];
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

  return lecturers?.$values.filter((lecturer) => matchesQuery(lecturer)) || [];
}, [lecturers, searchQuery]);

	const sortedLecturers = useMemo(() => {
		if (!sortColumn) return filteredLecturers;
		if (!lecturers) return [];
    return sortData(filteredLecturers, sortColumn as keyof typeof filteredLecturers[0], sortDirection);
	}, [filteredLecturers, sortColumn, sortDirection]);	

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedLecturers.slice(start, end);
  }, [sortedLecturers, page]);

  const [selectedItem, setSelectedItem] = useState<LecturerDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: LecturerDTO) => {
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
  } = useForm<LecturerDTO>({ mode: "onChange", defaultValues: { firstname: "", surname: "", patronymic: "", birthdate: "", departmentName: "" } });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
		reset: resetUpdate,
		watch: watchUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<LecturerDTO>({ mode: "onChange", defaultValues: { firstname: "", surname: "", patronymic: "", birthdate: "", departmentName: "" } });

  const [id, setId] = useState("");

  if (lecturers) {
    pages = Math.ceil(sortedLecturers.length / rowsPerPage);
  }

	const handleSubmitBtn = handleSubmitCreate(async (data) => {
		console.log("create", data);
    try {
      const response = await createLecturer(data);
      console.log(response);
      if (response.success === true) {
        const data = await getLecturers();
        setLecturers(data);
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
      const response = await deleteLecturer(id);
      console.log(response);
      if (response.success === true) {
        const data = await getLecturers();
        setLecturers(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

	const handleUpdate = handleSubmitUpdate(async (data: LecturerDTO) => {
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
    const fetchLecturers = async () => {
      const data = await getLecturers();
      setLecturers(data);
    };
		fetchLecturers();
  }, [setLecturers]);

  if (!lecturers) {
    return <LoadingSection />;
  }

	const columns = [
		{ key: "surname", label: "Last Name", sortable: true },
		{ key: "firstname", label: "First Name", sortable: true },
		{ key: "patronymic", label: "Patronymic", sortable: true },
		{ key: "birthdate", label: "Birthdate", sortable: true },
    { key: "departmentName", label: "Department", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
	];

	
	const getDepartmentsData = async (): Promise<string[]> => {
		if (cachedDepartments) {
			return cachedDepartments;
		}

		const departments: string[] = [];
		const response: DepartmentsPromise = await getDepartments();
		for (const department of response.$values) {
			departments.push(department.name);
		}
		cachedDepartments = departments;
		return departments;
	}

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
          Lecturers
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
            name="lecturer"
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
            <FormDateOnly
              name="birthdate"
              label="Birthdate"
              register={registerCreate}
              errors={errorsCreate}
              watch={watchCreate}
              setValue={setValueCreate}
							required
            />
            <FormSelect
              label="Department"
              data={getDepartmentsData()}
              name="departmentName"
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
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) =>
                    columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.id}
                          header="Lecturer details"
                          fetchData={getLecturer}
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
                          title="Delete lecturer"
                          content="Delete lecturer"
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
            name="lecturer"
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
            <FormDateOnly
              name="birthdate"
              label="Birthdate"
              register={registerUpdate}
              errors={errorsUpdate}
              watch={watchUpdate}
              setValue={() =>
                setValueUpdate("birthdate", selectedItem?.birthdate || "")
              }
              value={selectedItem?.birthdate}
							required
            />
            <FormSelect
              label="Department"
              data={getDepartmentsData()}
              name="departmentName"
              register={registerUpdate}
              errors={errorsUpdate}
              defaultSelectedValue={selectedItem?.departmentName}
              setValue={() =>
                setValueUpdate(
                  "departmentName",
                  selectedItem?.departmentName || "ww"
                )
              }
							required
            />
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
