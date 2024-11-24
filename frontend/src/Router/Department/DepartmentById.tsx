import { useParams, useNavigate } from "react-router-dom";
import { useDepartmentById } from "../../fetch/departmentFetch";
import { Button } from "@nextui-org/react";
import { TiArrowBackOutline } from "react-icons/ti";

export default function DepartmentById() {
	const { departmentId } = useParams<{ departmentId: string }>();
	const navigate = useNavigate();
	const { data, isLoading, error } = useDepartmentById(departmentId as string);

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

	return (
    <div className="flex flex-col gap-2">
      <h1>Department Page</h1>
      <h2>{data?.name}</h2>
      <Button
        onClick={() => navigate(-1)}
				startContent={<TiArrowBackOutline />}
				color="primary"
				size="sm"
				className="w-max"
      >
        Back
      </Button>
    </div>
  );
}