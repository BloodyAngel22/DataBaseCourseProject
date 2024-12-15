import CabinetDTO from "@/types/Cabinet/CabinetDTO";
import CabinetPromise from "@/types/Cabinet/CabinetPromise";
import CabinetsPromise from "@/types/Cabinet/CabinetsPromise";

const url = process.env.NEXT_PUBLIC_API_URL + '/Cabinet';

export async function getCabinets(): Promise<CabinetsPromise> {
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

export async function getCabinet(id: string): Promise<CabinetPromise> {
	const res = await fetch(`${url}/${id}`, {
		method: 'GET',
		next: {
			revalidate: 5 // revalidate every 5 seconds
		}
	});
	const data = await res.json();
	return data;
}

export async function createCabinet(data: CabinetDTO): Promise<{ success: boolean, message: string }> {
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

		return { success: true, message: 'Cabinet created successfully' };
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function deleteCabinet(id: string): Promise<{ success: boolean, message: string }> {
	try {
		const res = await fetch(`${url}/${id}`, {
			method: 'DELETE',
			credentials: 'include'
		});

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}
		return { success: true, message: 'Cabinet deleted successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}

export async function updateCabinet(id: string, data: CabinetDTO): Promise<{ success: boolean, message: string }> {
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
		return { success: true, message: 'Cabinet updated successfully' };	
	} catch (error) {
		return { success: false, message: (error as Error).message || 'Something went wrong' };
	}
}