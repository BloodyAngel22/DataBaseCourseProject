const url = process.env.NEXT_PUBLIC_API_URL + '/Auth';

export async function login(username: string, password: string): Promise<{
	request: {
		$id: string;
		message: string;
}}> {
	const loginUrl = `${url}/login`;
	const res = await fetch(loginUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({ username, password })
	});

	if (!res.ok) {
		const error = await res.text();
		throw new Error(error);
	}

	const data = await res.json();
	return { request: data };
}

export async function register(username: string, password: string, email: string): Promise<{ success: boolean, message: string }> {
	const registerUrl = `${url}/register`;
	const res = await fetch(registerUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({ username, password, email })
	});

	if (!res.ok) {
		const error = await res.text();
		throw new Error(error);
	}

	const data = await res.json();
	return { success: data.success, message: data.message };
}

export async function logout(): Promise<{ success: boolean, message: string }> {
	const logoutUrl = `${url}/logout`;
	const res = await fetch(logoutUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});

	if (!res.ok) {
		const error = await res.text();
		throw new Error(error);
	}

	const data = await res.json();
	return { success: data.success, message: data.message };
}