import { Route, Routes as Router } from 'react-router-dom'
import Main from './Main';
import StudentMain from './Student/StudentMain';
import DepartmentMain from './Department/DepartmentMain';
import Error from './Error';
import DepartmentById from './Department/DepartmentById';

export default function Routes() {
	return (
		<>
				<Router>
					<Route path='/' element={<Main />}></Route>
					<Route path='/student' element={<StudentMain />}></Route>
					<Route path='/department' element={<DepartmentMain/>}></Route>
				<Route path='/department/:departmentId' element={<DepartmentById />}></Route>
					<Route path='*' element={<Error />}></Route>
				</Router>
		</>
	);
}