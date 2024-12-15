import DisciplineDTO from "@/types/Discipline/DisciplineDTO";
import DisciplinePromise from "@/types/Discipline/DisciplinePromise";
import DisciplinesPromise from "@/types/Discipline/DisciplinesPromise";

const url = process.env.NEXT_PUBLIC_API_URL + '/Discipline';

export async function getDisciplines(): Promise<DisciplinesPromise> {
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

export async function getDiscipline(id: string): Promise<DisciplinePromise> {
	const res = await fetch(`${url}/${id}`, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		}
	});
	const data = await res.json();
	return data;
}

export async function createDiscipline(data: DisciplineDTO): Promise<{ success: boolean, message: string }> {
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

		return { success: true, message: 'Discipline created successfully' };
	} catch (error) {
		console.error('Discipline');
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function deleteDiscipline(id: string): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${id}`, {
			method: 'DELETE',
			credentials: 'include'
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Discipline deleted successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function updateDiscipline(id: string, data: DisciplineDTO): Promise<{ success: boolean, message: string }> {
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
		return { success: true, message: 'Discipline updated successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}