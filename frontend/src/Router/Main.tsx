import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import GetStudentData from "../fetch/getStudentData";

export default function Main() {
  const { data, isLoading, error } = GetStudentData();

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
    { key: "firstname", label: "First Name" },
    { key: "surname", label: "Last Name" },
    { key: "patronymic", label: "Patronymic" },
    { key: "course", label: "Course" },
    { key: "groupName", label: "Group Name" },
    { key: "birthdate", label: "Birthdate" },
	];

  return (
    <>
      <h1>Main Page</h1>
      <Table aria-label="Table">
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
                  {(key) => <TableCell>{getKeyValue(student, key)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </>
        )}
      </Table>
    </>
  );
}
