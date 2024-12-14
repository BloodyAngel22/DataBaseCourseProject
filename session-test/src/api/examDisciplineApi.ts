import ExamDisciplineDTO from "@/types/ExamDiscipline/ExamDisciplineDTO";
import ExamDisciplineFilter from "@/types/ExamDiscipline/ExamDisciplineFilter";
import ExamDisciplinePromise from "@/types/ExamDiscipline/ExamDisciplinePromise";
import ExamDisciplinesPromise from "@/types/ExamDiscipline/ExamDisciplinesPromise";

const url = process.env.NEXT_PUBLIC_API_URL + '/ExamDiscipline';

export async function getExamDisciplines(): Promise<ExamDisciplinesPromise> {
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

export async function getFilteredExamDisciplines(filter: ExamDisciplineFilter): Promise<ExamDisciplinesPromise> {
	const queryString = new URLSearchParams(filter as Record<string, string>).toString();
	const url = `${process.env.NEXT_PUBLIC_API_URL}/ExamDiscipline?${queryString}`;
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

export async function getExamDiscipline(id: string): Promise<ExamDisciplinePromise> {
	const res = await fetch(`${url}/${id}`, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		}
	});
	const data = await res.json();
	return data;
}

export async function createExamDiscipline(data: ExamDisciplineDTO): Promise<{ success: boolean, message: string }> {
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

		return { success: true, message: 'Exam discipline created successfully' };
	} catch (error) {
		console.error('Exam discipline');
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function deleteExamDiscipline(id: string): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${id}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Exam discipline deleted successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function updateExamDiscipline(id: string, data: ExamDisciplineDTO): Promise<{ success: boolean, message: string }> {
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
		return { success: true, message: 'Exam discipline updated successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}