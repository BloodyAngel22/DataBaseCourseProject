export default interface StudentsPromise {
	$id: string;
	$values: {
		$id: string;
		id: string;
		firstname: string;
		surname: string;
		patronymic: string;
		course: number;
		birthdate: string;
		groupName: string;
	}[]
}