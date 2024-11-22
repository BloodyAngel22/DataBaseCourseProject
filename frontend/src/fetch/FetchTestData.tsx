import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
	id: number;
	userId: number;
	title: string;
	body: string;
}

export default function FetchTestData() {
	const fetchData = async (): Promise<Post[]> => {
		const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
		return response.data;
	};

	const { data, isLoading, error } = useQuery<Post[], Error>({
		queryKey: ['posts'],
		queryFn: fetchData
	});

	return { data, isLoading, error }
}