export default interface ExamDisciplinesPromise {
	$id: string;
	$values: {
		$id: string;
		id: string;
		disciplineName: string;
		eventDatetime: string;
		lecturerId: string;
		cabinetRoomName: string;
		eventFormType: string;
		lecturer: {
			$id: string;
			id: string;
			firstname: string;
			surname: string;
			patronymic: string;
			birthdate: string;
			departmentName: string;
			fio: string;
		}
	}[];
}