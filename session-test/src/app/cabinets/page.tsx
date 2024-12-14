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
import { createCabinet, deleteCabinet, getCabinet, getCabinets, updateCabinet } from "@/api/cabinetApi";
import CabinetDTO from "@/types/Cabinet/CabinetDTO";
import CabinetsPromise from "@/types/Cabinet/CabinetsPromise";
import sortData from "../../functions/sortData";

export default function CabinetsPage() {
  const [cabinets, setCabinets] = useState<CabinetsPromise>();
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);
	const [page, setPage] = useState(1);
	
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const rowsPerPage = 5;
	let pages = 0;

	const filteredCabinets = useMemo(() => {
		if (!searchQuery) return cabinets?.$values || [];
		const lowerQuery = searchQuery.toLowerCase();
		return cabinets?.$values.filter((cabinet) =>
			Object.values(cabinet).some((value) =>
				typeof value === "string" && value.toLowerCase().includes(lowerQuery)
			)
		) || [];
	}, [cabinets, searchQuery]);

	const sortedCabinets = useMemo(() => {
		if (!sortColumn) return filteredCabinets;
		if (!cabinets) return [];
    return sortData(filteredCabinets, sortColumn as keyof typeof filteredCabinets[0], sortDirection);
	}, [filteredCabinets, sortColumn, sortDirection]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedCabinets.slice(start, end);
  }, [sortedCabinets, page]);

  const [selectedItem, setSelectedItem] = useState<CabinetDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: CabinetDTO) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<CabinetDTO>({ mode: "onChange", defaultValues: { roomName: "" } });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<CabinetDTO>({ mode: "onChange", defaultValues: { roomName: "" } });

  const [id, setId] = useState("");

  if (cabinets) {
    pages = Math.ceil(sortedCabinets.length / rowsPerPage);
  }

  const handleSubmitBtn = handleSubmitCreate(async (data) => {
    try {
      const response = await createCabinet(data);
      console.log(response);
      if (response.success === true) {
        const data = await getCabinets();
        setCabinets(data);
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
      const response = await deleteCabinet(id);
      console.log(response);
      if (response.success === true) {
        const data = await getCabinets();
        setCabinets(data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

	const handleUpdate = handleSubmitUpdate(async (data: CabinetDTO) => {
		if (data.roomName === id) {
			setIsModalOpen(false);
			setSelectedItem(null);
			return;
		};
    console.log("update", id, data);
    try {
      const response = await updateCabinet(id, data);
      console.log(response);
      if (response.success === true) {
        const data = await getCabinets();
				setCabinets(data);
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
    const fetchCabinets = async () => {
      const data = await getCabinets();
      setCabinets(data);
    };
    fetchCabinets();
  }, [setCabinets]);

  if (!cabinets) {
    return <LoadingSection />;
  }

  const columns = [
    { key: "roomName", label: "Name", sortable: true },
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
          Cabinets
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
            name="cabinet"
            onSubmit={handleSubmitBtn}
            loading={false}
            error={null}
            setIsCreatedSuccess={setIsCreatedSuccess}
            isCreatedSuccess={isCreatedSuccess}
          >
            <FormInput
              name="roomName"
              register={registerCreate}
              errors={errorsCreate}
              maxLength={100}
              type="text"
							label="Name"
							required
            />
          </ModalCreate>
        </div>

				<div className="bg-white rounded-lg shadow overflow-hidden">
					<Input type="text" label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
											{column.sortable && sortColumn === column.key ? sortDirection === "asc" ? <TiArrowDownThick /> : <TiArrowUpThick /> : null}
										</span>
									</div>
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.roomName}>
                  {(columnKey) =>
                    columnKey === "actions" ? (
                      <TableCell className="flex gap-4">
                        <ModalDetail
                          id={item.roomName}
                          header="Cabinet details"
                          fetchData={getCabinet}
												/>
												<Tooltip content="Update details">
                        <Button
                          isIconOnly
                          size="sm"
                          color="secondary"
													onPress={() => { openModal(item); setId(item.roomName); }}
                          variant="shadow"
                          className="scale-85"
                          startContent={<FiEdit3 className="text-lg" />}
													/>
												</Tooltip>

                        <ModalDelete
                          title="Delete cabinet"
                          content="Delete cabinet"
                          id={item.roomName}
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
            name="cabinet"
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
              name="roomName"
              register={registerUpdate}
              errors={errorsUpdate}
              maxLength={100}
							type="text"
							label="Name"
              setValue={() => {
                setValueUpdate("roomName", selectedItem?.roomName || "");
              }}
							required
            />
          </ModalUpdate>
        </div>
      </div>
    </div>
  );
}
