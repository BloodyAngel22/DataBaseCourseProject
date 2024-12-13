export default interface StatementsPromise {
	$id: string;
	$values: {
		$id: string;
		id: string;
		examDisciplineId: string;
		sessionYear: number;
		dateIssued: string;
		examDiscipline: {
			$id: string;
			id: string;
			disciplineName: string;
			eventDatetime: string;
			lecturerId: string;
			cabinetRoomName: string;
			eventFormType: string;
		}
	}[];
}