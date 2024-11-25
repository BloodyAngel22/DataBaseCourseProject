import {
  Button,
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useDepartmentData } from "../../fetch/departmentFetch";
import { useNavigate } from "react-router-dom";
import ModalCreate from "../../components/ModalCreate";
import ModalUpdate from "../../components/ModalUpdate";
import { useForm } from "react-hook-form";
import FormInput from "../../components/FormInput";
import IUpdateDepartment from "../../types/IUpdateDepartment";
import LoadData from "../../components/LoadData";
import EmptyTableData from "../../components/EmptyTableData";
import ErrorComponent from "../../components/ErrorComponent";

export default function DepartmentMain() {
  const { data, isLoading, error, onSubmit, handleDelete, handleUpdate } =
    useDepartmentData();
  const navigate = useNavigate();
  const {
    register,
		handleSubmit,
		setValue,
    formState: { errors },
  } = useForm<IUpdateDepartment>({
    mode: "onChange",
	});

  const handleDetails = (id: string) => {
    navigate(`/department/${id.toLowerCase()}`);
  };

	if (isLoading) return <LoadData />;
  if (error) return <ErrorComponent error={error.message} pageName="Department page" />;

  const columns = [
    { key: "name", label: "Name" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <h1>Department Page</h1>

      <ModalCreate
        header="Create new department"
        handleSubmit={handleSubmit(onSubmit)}
        btnText="Create"
      >
        <FormInput
          name="name"
          register={register}
          errors={errors}
          placeholder="Department name"
          maxLength={100}
        />
      </ModalCreate>

      <Table aria-label="Table" isStriped>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        {data?.$values?.length ? (
          <TableBody items={data.$values}>
            {(department) => (
              <TableRow key={department.name}>
                {(key) =>
                  key === "actions" ? (
                    <TableCell className="flex gap-2">
                      <Tooltip content="Details">
                        <Button
                          isIconOnly
                          size="sm"
                          color="primary"
                          onClick={() => handleDetails(department.name)}
                        >
                          <FaEye />
                        </Button>
                      </Tooltip>
                      <ModalUpdate
                        header="Update department"
                        btnText="Update"
                        handleSubmit={handleSubmit(handleUpdate)}
                        onClick={() => {
                          setValue("id", department.name);
                          setValue("name", department.name);
                        }}
                      >
                        <FormInput
                          name="name"
                          register={register}
                          errors={errors}
                          placeholder="Department name"
                          maxLength={100}
                        />
                      </ModalUpdate>
                      <Tooltip content="Delete">
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          onClick={() => handleDelete(department.name)}
                        >
                          <MdOutlineDelete />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  ) : (
                    <TableCell>{getKeyValue(department, key)}</TableCell>
                  )
                }
              </TableRow>
            )}
          </TableBody>
        ) : (
          <EmptyTableData />
        )}
      </Table>
    </div>
  );
}
