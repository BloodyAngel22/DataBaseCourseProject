export default interface LecturersPromise {
	$id: string;
	$values: {
		$id: string;
		id: string;
		firstname: string;
		surname: string;
		patronymic: string;
		birthdate: string;
		departmentName: string;
	}[];
}