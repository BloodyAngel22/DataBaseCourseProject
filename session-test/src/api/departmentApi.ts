import { DepartmentPromise } from "../types/DepartmentPromise";
import { DepartmentsPromise } from "../types/DepartmentsPromise";

const url = process.env.NEXT_PUBLIC_API_URL + '/Department';

export async function getDepartments(): Promise<DepartmentsPromise> {
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

export async function getDepartment(id: string): Promise<DepartmentPromise> {
	const res = await fetch(`${url}/${id}`, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		}
	});
	const data = await res.json();
	return data;
}

export async function createDepartment(data: DepartmentDTO): Promise<{ success: boolean, message: string }> {
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

		return { success: true, message: 'Department created successfully' };
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function deleteDepartment(id: string): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${id}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Department deleted successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function updateDepartment(id: string, data: DepartmentDTO): Promise<{ success: boolean, message: string }> {
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
		return { success: true, message: 'Department updated successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}