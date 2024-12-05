import { getDepartment } from "@/api/departmentApi";

interface DepartmentPageProps {
	params: {
		name: string;
	};
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
	const { name } = params;
	const decodeName = decodeURIComponent(name);

	const department = await getDepartment(decodeName);

	return (
		<div className="min-h-screen">
			<span>{department.$id}</span>
			<h1>{department.name}</h1>
		</div>
	);
}