export default interface MarkPromise {
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
		examDiscipline: {
			$id: string;
			disciplineName: string;
			cabinetRoomName: string;
			eventDatetime: string;
			eventFormType: string;
		}
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
}
