import EventFormTypesPromise from "@/types/EventFormType/EventFormTypesPromise";

const url = process.env.NEXT_PUBLIC_API_URL + '/EventForm';

export async function getEventFormTypes(): Promise<EventFormTypesPromise> {
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