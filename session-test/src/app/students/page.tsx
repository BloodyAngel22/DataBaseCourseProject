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
	Input,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@/components/Form/FormInput";
import { TiArrowBackOutline, TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import LoadingSection from "@/components/LoadingSection";
import { getGroups } from "@/api/groupApi";
import FormSelect from "@/components/Form/FormSelect";
import GroupsPromise from "@/types/Group/GroupsPromise";
import FormDateOnly from "@/components/Form/FormDateOnly";
import StudentsPromise from "@/types/Student/StudentsPromise";
import { getFilteredStudents, getStudent, getStudents } from "@/api/studentApi";
import sortData from "@/functions/sortData";
import FilterSection from "@/components/FilterSection";
import StudentFilter from "@/types/Student/StudentFilter";

let cachedGroups: string[] | null = null;

//FIXME: Сделать возможность изменения даты рождения студента 
export default function StudentsPage() {
  const [students, setStudents] = useState<StudentsPromise>();
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

	const {
		register: registerFilter,
		handleSubmit: handleSubmitFilter,
		reset: resetFilter,
		watch: watchFilter,
		setValue: setValueFilter,
		formState: { errors: errorsFilter },
	} = useForm<StudentFilter>({ mode: "onChange", defaultValues: { course: "", groupName: "", dateStart: "", dateEnd: "" } });

  if (students) {
    pages = Math.ceil(sortedStudents.length / rowsPerPage);
  }

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
								watch={watchFilter}
								setValue={setValueFilter}
							/>
							<FormDateOnly
								name="dateEnd"
								label="Date End"
								register={registerFilter}
								errors={errorsFilter}
								watch={watchFilter}
								setValue={setValueFilter}
							/>
						</FilterSection>

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
                    columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.id}
                          header="Student details"
                          fetchData={getStudent}
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
