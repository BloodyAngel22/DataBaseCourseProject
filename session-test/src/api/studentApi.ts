import StudentDTO from "@/types/Student/StudentDTO";
import StudentFilter from "@/types/Student/StudentFilter";
import StudentPromise from "@/types/Student/StudentPromise";
import StudentsPromise from "@/types/Student/StudentsPromise";

const url = process.env.NEXT_PUBLIC_API_URL + '/Student';

export async function getStudents(): Promise<StudentsPromise> {
	console.log(url);
	const res = await fetch(url, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		}
	});
	const data = await res.json();
	return data;
}

export async function getFilteredStudents(filter: StudentFilter): Promise<StudentsPromise> {
	const queryString = new URLSearchParams(filter as Record<string, string>).toString();
	const url = `${process.env.NEXT_PUBLIC_API_URL}/Student?${queryString}`;
	console.log(url);
	const res = await fetch(url, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		},
		headers: {
			'Content-Type': 'application/json'
		},
	});
	const data = await res.json();
	return data;
}

export async function getStudent(id: string): Promise<StudentPromise> {
	const res = await fetch(`${url}/${id}`, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		}
	});
	const data = await res.json();
	return data;
}

export async function createStudent(data: StudentDTO): Promise<{ success: boolean, message: string }> {
	console.log(url);
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}

		return { success: true, message: 'Student created successfully' };
	} catch (error) {
		console.error('Student');
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function deleteStudent(id: string): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${id}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Student deleted successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function updateStudent(id: string, data: StudentDTO): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Student updated successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}