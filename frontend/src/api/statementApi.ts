import StatementDTO from "@/types/Statement/StatementDTO";
import StatementFilter from "@/types/Statement/StatementFilter";
import StatementPromise from "@/types/Statement/StatementPromise";
import StatementsPromise from "@/types/Statement/StatementsPromise";

const url = process.env.NEXT_PUBLIC_API_URL + '/Statement';

export async function getStatements(): Promise<StatementsPromise> {
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

export async function getFilteredStatements(filter: StatementFilter): Promise<StatementsPromise> {
	const queryString = new URLSearchParams(filter as Record<string, string>).toString();
	const url = `${process.env.NEXT_PUBLIC_API_URL}/Statement?${queryString}`;
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

export async function getStatement(id: string): Promise<StatementPromise> {
	const res = await fetch(`${url}/${id}`, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		}
	});
	const data = await res.json();
	return data;
}

export async function createStatement(data: StatementDTO): Promise<{ success: boolean, message: string }> {
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

		return { success: true, message: 'Statement created successfully' };
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function deleteStatement(id: string): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${id}`, {
			method: 'DELETE',
			credentials: 'include'
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Statement deleted successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function updateStatement(id: string, data: StatementDTO): Promise<{ success: boolean, message: string }> {
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
		return { success: true, message: 'Statement updated successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}