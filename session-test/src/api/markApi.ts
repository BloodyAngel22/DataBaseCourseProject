import MarkDTO from "@/types/Mark/MarkDTO";
import MarkPromise from "@/types/Mark/MarkPromise";
import MarksPromise from "@/types/Mark/MarksPromise";

const url = process.env.NEXT_PUBLIC_API_URL + '/Mark';

export async function getMarks(): Promise<MarksPromise> {
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

export async function getMark(studentId: string, statementId: string): Promise<MarkPromise> {
	const res = await fetch(`${url}/${studentId}/${statementId}`, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		}
	});
	const data = await res.json();
	return data;
}

export async function createMark(data: MarkDTO): Promise<{ success: boolean, message: string }> {
	console.log(url);
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}

		return { success: true, message: 'Mark created successfully' };
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function deleteMark(studentId: string, statementId: string): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${studentId}/${statementId}`, {
			method: 'DELETE',
			credentials: 'include'
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Mark deleted successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function updateMark(id: string, data: MarkDTO): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Mark updated successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}