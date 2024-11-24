import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Student {
	$id: string;
	$values: {
		id: string;
		firstname: string;
		surname: string;
		patronymic: string;
		course: number;
		birthdate: string;
		groupName: string;
	}[];
}

export default function GetStudents() {
	const fetchData = async (): Promise<Student> => {
		const response = await axios.get('/api/Student');
		return response.data;
	};

	const { data, isLoading, error } = useQuery<Student, Error>({
		queryKey: ['students'],
		queryFn: fetchData
	});

	return { data, isLoading, error }
}