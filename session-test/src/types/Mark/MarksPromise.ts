export default interface MarksPromise {
	$id: string;
	$values: {
		$id: string;
		mark1: string;
		studentId: string;
		statementId: string;
		statement: {
			$id: string;
			id: string;
			examDisciplineId: string;
			sessionYear: number;
			dateIssued: string;
		};
		student: {
			$id: string;
			id: string;
			firstname: string;
			surname: string;
			patronymic: string;
			course: number;
			birthdate: string;
			groupName: string;
		};
	}[];
}