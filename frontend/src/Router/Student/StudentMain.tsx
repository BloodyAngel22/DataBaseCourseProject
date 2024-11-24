import { Button, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDelete, MdOutlineLibraryAdd } from "react-icons/md";
import GetStudents from "../../fetch/Student/getStudents";

export default function StudentMain() {
  const { data, isLoading, error } = GetStudents();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return (
      <>
        <h1>Main page</h1>
        <h2>Error: {error.message}</h2>
      </>
    );
  }

	const columns = [
		{ key: "surname", label: "Last Name" },
		{ key: "firstname", label: "First Name" },
		{ key: "patronymic", label: "Patronymic" },
		{ key: "course", label: "Course" },
		{ key: "groupName", label: "Group Name" },
		{ key: "actions", label	: "Actions" },
	];

	return (
		<div className="flex flex-col gap-2">
			<h1>Student Page</h1>

      <Button color="primary" startContent={<MdOutlineLibraryAdd />} size="sm" className="w-max">
        Add student
      </Button>
      <Table aria-label="Table" isStriped>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        {data?.$values?.length === 0 ? (
          <>
            <TableBody emptyContent={"No data"}>{[]}</TableBody>
          </>
        ) : (
          <>
            <TableBody items={data?.$values}>
              {(student) => (
                <TableRow key={student.id}>
                  {(key) =>
                    key === "actions" ? (
                      <TableCell className="flex gap-2">
                        <Tooltip content="Details">
                          <Button isIconOnly size="sm" color="primary">
                            <FaEye />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit">
                          <Button isIconOnly size="sm" color="secondary">
                            <FiEdit3 />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <Button isIconOnly size="sm" color="danger">
                            <MdOutlineDelete />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    ) : (
                      <TableCell>{getKeyValue(student, key)}</TableCell>
                    )
                  }
                </TableRow>
              )}
            </TableBody>
          </>
        )}
      </Table>
		</div>
	);
}