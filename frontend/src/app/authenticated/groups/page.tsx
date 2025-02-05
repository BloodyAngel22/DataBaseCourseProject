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
import { createGroup, deleteGroup, getGroup, getGroups, updateGroup } from "@/api/groupApi";
import FormSelect from "@/components/Form/FormSelect";
import DepartmentsPromise from "@/types/Department/DepartmentsPromise";
import GroupDTO from "@/types/Group/GroupDTO";
import GroupsPromise from "@/types/Group/GroupsPromise";
import sortData from "@/functions/sortData";

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupsPromise>();
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
	const [page, setPage] = useState(1);

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");	

  const rowsPerPage = 5;
	let pages = 0;

	const filteredGroups = useMemo(() => {
		if (!searchQuery) return groups?.$values || [];
		const lowerQuery = searchQuery.toLowerCase();
		return groups?.$values.filter((group) =>
			Object.values(group).some((value) =>
				typeof value === "string" && value.toLowerCase().includes(lowerQuery)
			)
		) || [];
	}, [groups, searchQuery]);

	const sortedGroups = useMemo(() => {
		if (!sortColumn) return filteredGroups;
		if (!groups) return [];
    return sortData(filteredGroups, sortColumn as keyof typeof filteredGroups[0], sortDirection);
	}, [filteredGroups, sortColumn, sortDirection]);	

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedGroups.slice(start, end);
  }, [sortedGroups, page]);

  const [selectedItem, setSelectedItem] = useState<GroupDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: GroupDTO) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<GroupDTO>({ mode: "onChange", defaultValues: { name: "", departmentName: "" } });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<GroupDTO>({ mode: "onChange", defaultValues: { name: "", departmentName: "" } });

  const [id, setId] = useState("");

  if (groups) {
    pages = Math.ceil(sortedGroups.length / rowsPerPage);
  }

	const handleSubmitBtn = handleSubmitCreate(async (data) => {
		console.log("create", data);
    try {
      const response = await createGroup(data);
      console.log(response);
      if (response.success === true) {
        const data = await getGroups();
        setGroups(data);
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
      const response = await deleteGroup(id);
      console.log(response);
      if (response.success === true) {
        const data = await getGroups();
        setGroups(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

	const handleUpdate = handleSubmitUpdate(async (data: GroupDTO) => {
		console.log("update", id, data);

    try {
      const response = await updateGroup(id, data);
      console.log(response);
      if (response.success === true) {
        const data = await getGroups();
				setGroups(data);
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
    const fetchGroups = async () => {
      const data = await getGroups();
      setGroups(data);
    };
		fetchGroups();
  }, [setGroups]);

  if (!groups) {
    return <LoadingSection />;
  }

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "departmentName", label: "Department", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
	];
	
	const getDepartmentsData = async () => {
		const departments: any[] = [];
		const response: DepartmentsPromise = await getDepartments();
		for (const department of response.$values) {
			departments.push(department.name);
		}
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
          Groups
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
            name="group"
            onSubmit={handleSubmitBtn}
            loading={false}
            error={null}
            setIsCreatedSuccess={setIsCreatedSuccess}
            isCreatedSuccess={isCreatedSuccess}
          >
            <FormInput
              name="name"
              register={registerCreate}
              errors={errorsCreate}
              maxLength={100}
              type="text"
              label="Name"
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
            <TableBody items={items} emptyContent={"No data"}>
              {(item) => (
                <TableRow key={item.name}>
                  {(columnKey) =>
                    columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.name}
                          header="Group details"
                          fetchData={getGroup}
                        />
                        <Tooltip content="Update details">
                          <Button
                            isIconOnly
                            size="sm"
                            color="secondary"
                            onPress={() => {
                              openModal(item);
                              setId(item.name);
                            }}
                            variant="shadow"
                            className="scale-85"
                            startContent={<FiEdit3 className="text-lg" />}
                          />
                        </Tooltip>

                        <ModalDelete
                          title="Delete group"
                          content="Delete group"
                          id={item.name}
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
            name="group"
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
              name="name"
              register={registerUpdate}
              errors={errorsUpdate}
              maxLength={100}
              type="text"
              label="Name"
              setValue={() => {
                setValueUpdate("name", selectedItem?.name || "");
              }}
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
