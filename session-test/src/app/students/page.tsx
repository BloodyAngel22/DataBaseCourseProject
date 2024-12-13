"use client";

import {
  getDepartments,
} from "@/api/departmentApi";
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
import { createGroup, deleteGroup, getGroup, getGroups, updateGroup } from "@/api/groupApi";
import FormSelect from "@/components/FormSelect";
import DepartmentsPromise from "@/types/Department/DepartmentsPromise";
import GroupDTO from "@/types/Group/GroupDTO";
import GroupsPromise from "@/types/Group/GroupsPromise";
import LecturersPromise from "@/types/Lecturer/LecturersPromise";
import LecturerDTO from "@/types/Lecturer/LecturerDTO";
import { createLecturer, deleteLecturer, getLecturer, getLecturers, updateLecturer } from "@/api/lecturerApi";
import FormDateOnly from "@/components/FormDateOnly";
import StudentsPromise from "@/types/Student/StudentsPromise";
import StudentDTO from "@/types/Student/StudentDTO";
import { createStudent, deleteStudent, getStudent, getStudents } from "@/api/studentApi";

let cachedGroups: string[] | null = null;

//FIXME: Сделать возможность изменения даты рождения студента 
export default function StudentsPage() {
  const [students, setStudents] = useState<StudentsPromise>();
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  let pages = 0;
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return students?.$values.slice(start, end);
  }, [students, page]);

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

  const [id, setId] = useState("");

  if (students) {
    pages = Math.ceil(students.$values.length / rowsPerPage);
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
		{ key: "surname", label: "Last Name" },
		{ key: "firstname", label: "First Name" },
		{ key: "patronymic", label: "Patronymic" },
		{ key: "birthdate", label: "Birthdate" },
    { key: "groupName", label: "Group" },
    { key: "actions", label: "Actions" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white p-4">
      <div className="container mx-auto">
				<h1 className="text-4xl font-extrabold text-center mb-2 text-white drop-shadow-md">
					Students
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
						/>
						<FormInput
							name="surname"
							register={registerCreate}
							errors={errorsCreate}
							maxLength={100}
							type="text"
							label="Last Name"
						/>
						<FormInput
							name="patronymic"
							register={registerCreate}
							errors={errorsCreate}
							maxLength={100}
							type="text"
							label="Patronymic"
						/>
						<FormInput
							name="course"
							register={registerCreate}
							errors={errorsCreate}	
							type="number"
							label="Course"
							min={1}
							max={5}
						/>
						<FormDateOnly
							name="birthdate"
							label="Birthdate"
							register={registerCreate}
							errors={errorsCreate}
							watch={watchCreate}
							setValue={setValueCreate}
						/>
						<FormSelect
							label="Group"
							data={getGroupsData()}
							name="groupName"
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
													onPress={() => { openModal(item); setId(item.id); }}
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
						/>
						<FormDateOnly
							name="birthdate"
							label="Birthdate"
							register={registerUpdate}
							errors={errorsUpdate}
							watch={watchUpdate}
							setValue={() => setValueUpdate("birthdate", selectedItem?.birthdate || "")}
							value={selectedItem?.birthdate}
						/>
						<FormSelect
							label="Group"
							data={getGroupsData()}
							name="groupName"
							register={registerUpdate}
							errors={errorsUpdate}
							defaultSelectedValue={selectedItem?.groupName}
							setValue={() => setValueUpdate("groupName", selectedItem?.groupName || "ww")}
						/>
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
