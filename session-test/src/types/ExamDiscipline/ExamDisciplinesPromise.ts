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
	}[];
}