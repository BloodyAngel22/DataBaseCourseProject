import { useParams, useNavigate } from "react-router-dom";
import { useDepartmentById } from "../../fetch/departmentFetch";
import { Button } from "@nextui-org/react";
import { TiArrowBackOutline } from "react-icons/ti";
import LoadData from "../../components/LoadData";
import ErrorComponent from "../../components/ErrorComponent";

export default function DepartmentById() {
	const { departmentId } = useParams<{ departmentId: string }>();
	const navigate = useNavigate();
	const { data, isLoading, error } = useDepartmentById(departmentId as string);

	if (isLoading) return <LoadData />;
	if (error) return <ErrorComponent error={error.message} pageName="Department page" />;

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