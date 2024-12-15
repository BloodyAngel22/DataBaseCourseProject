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
import DepartmentDTO from "@/types/Department/DepartmentDTO";
import DepartmentsPromise from "@/types/Department/DepartmentsPromise";
import DisciplinesPromise from "@/types/Discipline/DisciplinesPromise";
import DisciplineDTO from "@/types/Discipline/DisciplineDTO";
import { createDiscipline, deleteDiscipline, getDiscipline, getDisciplines, updateDiscipline } from "@/api/disciplineApi";
import sortData from "@/functions/sortData";

export default function DisciplinesPage() {
  const [disciplines, setDisciplines] = useState<DisciplinesPromise>();
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
	const [page, setPage] = useState(1);

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const rowsPerPage = 5;
	let pages = 0;
	
	const filteredDisciplines = useMemo(() => {
		if (!searchQuery) return disciplines?.$values || [];
		const lowerQuery = searchQuery.toLowerCase();
		return disciplines?.$values.filter((discipline) =>
			Object.values(discipline).some((value) =>
				typeof value === "string" && value.toLowerCase().includes(lowerQuery)
			)
		) || [];
	}, [disciplines, searchQuery]);

	const sortedDisciplines = useMemo(() => {
		if (!sortColumn) return filteredDisciplines;
		if (!disciplines) return [];
    return sortData(filteredDisciplines, sortColumn as keyof typeof filteredDisciplines[0], sortDirection);
	}, [filteredDisciplines, sortColumn, sortDirection]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedDisciplines.slice(start, end);
  }, [sortedDisciplines, page]);

  const [selectedItem, setSelectedItem] = useState<DisciplineDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: DisciplineDTO) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<DisciplineDTO>({ mode: "onChange", defaultValues: { name: "" } });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<DisciplineDTO>({ mode: "onChange", defaultValues: { name: "" } });

  const [id, setId] = useState("");

  if (disciplines) {
    pages = Math.ceil(sortedDisciplines.length / rowsPerPage);
  }

  const handleSubmitBtn = handleSubmitCreate(async (data) => {
    try {
      const response = await createDiscipline(data);
      console.log(response);
      if (response.success === true) {
        const data = await getDisciplines();
        setDisciplines(data);
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
      const response = await deleteDiscipline(id);
      console.log(response);
      if (response.success === true) {
        const data = await getDisciplines();
        setDisciplines(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

	const handleUpdate = handleSubmitUpdate(async (data: DisciplineDTO) => {
		if (data.name === id) {
			setIsModalOpen(false);
			setSelectedItem(null);
			return;
		};
    console.log("update", id, data);
    try {
      const response = await updateDiscipline(id, data);
      console.log(response);
      if (response.success === true) {
        const data = await getDisciplines();
				setDisciplines(data);
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
    const fetchDisciplines = async () => {
      const data = await getDisciplines();
      setDisciplines(data);
    };
    fetchDisciplines();
  }, [setDisciplines]);

  if (!disciplines) {
    return <LoadingSection />;
  }

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
	];

		const handleSort = (key: string) => {
		if (sortColumn === key) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(key);
			setSortDirection("asc");
		}
	};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white drop-shadow-md">
          Disciplines
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
                <TableRow key={item.name}>
                  {(columnKey) =>
                    columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.name}
                          header="Discipline details"
                          fetchData={getDiscipline}
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

        </div>
      </div>
    </div>
  );
}
