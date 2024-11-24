import { Button, getKeyValue, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { useCreateDepartment, useDeleteDepartment, useDepartments } from "../../fetch/departmentFetch";
import { useNavigate } from "react-router-dom";
import ModalCreate from "../../components/ModalCreate";
import { SubmitHandler, useForm } from "react-hook-form";

interface DepartmentData {
	name: string;
}

export default function DepartmentMain() {
	const { data, isLoading, error } = useDepartments();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DepartmentData>({
		mode: "onChange",
	});

	const { mutate } = useCreateDepartment();

	const onSubmit: SubmitHandler<DepartmentData> = async (data) => {
		data.name = data.name.toLowerCase();
		mutate(data);
	}

	const { mutate: deleteDepartment } = useDeleteDepartment();
	const handleDelete = (id: string) => {
		id = id.toLowerCase();
		deleteDepartment(id);
	}

	if (isLoading) {
		return <p>Loading...</p>;
	}
	if (error) {
		return (
			<>
				<h1>Department page</h1>
				<h2>Error: {error.message}</h2>
			</>
		);
	}

	const handleDetails = (id: string) => {
		id = id.toLowerCase();
		navigate(`/department/${id}`);
	};

	const columns = [
		{ key: "name", label: "Name" },
		{ key: "actions", label: "Actions" }
	];

	return (
    <div className="flex flex-col gap-2">
      <h1>Department Page</h1>

      <ModalCreate
        header="Create new department"
        handleSubmit={handleSubmit(onSubmit)}
      >
        <Input
          isRequired
          placeholder="Department name"
          label="Name"
          {...register("name", {
            required: "Name is required",
            maxLength: { value: 100, message: "Name is too long" },
          })}
          errorMessage={errors.name?.message && errors.name?.message}
          isInvalid={!!errors.name}
        />
      </ModalCreate>

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
                        <Tooltip content="Edit">
                          <Button isIconOnly size="sm" color="secondary">
                            <FiEdit3 />
                          </Button>
                        </Tooltip>
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
          </>
        )}
      </Table>
    </div>
  );
}