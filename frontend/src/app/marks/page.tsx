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
  Input,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TiArrowBackOutline, TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import LoadingSection from "@/components/LoadingSection";
import StatementsPromise from "@/types/Statement/StatementsPromise";
import {
  getStatements,
} from "@/api/statementApi";
import MarksPromise from "@/types/Mark/MarksPromise";
import StudentsPromise from "@/types/Student/StudentsPromise";
import { getMark, getMarks } from "@/api/markApi";
import { getStudents } from "@/api/studentApi";
import sortData from "@/functions/sortData";

export default function MarksPage() {
  const [marks, setMarks] = useState<MarksPromise>();
  const [statements, setStatements] =
		useState<StatementsPromise>();
	const [students, setStudents] = useState<StudentsPromise>();

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");	

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

  if (marks) {
    pages = Math.ceil(sortedMarks.length / rowsPerPage);
  }

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
	
	const getFIOStudentById = (id: string) => {
		if (!students) {
			return "Unknown";
		}
		const student = students?.$values.find((student) => student.id === id);
		return student ? `${student?.surname} ${student?.firstname} ${student?.patronymic}` : "Unknown";
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
            <TableBody items={items} emptyContent={"No data"}>
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

        </div>
      </div>
    </div>
  );
}
