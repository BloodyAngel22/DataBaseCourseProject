import { Route, BrowserRouter, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './Router/NabBar'
import Main from './Router/Main'
import About from './Router/About'
import Error from './Router/Error'
import HookForm from './Router/HookForm'

function App() {

  return (
		<>
			<BrowserRouter future={{
				v7_startTransition: true,
			}}>
				<NavBar />
				<Routes>
					<Route path='/' element={<Main />}></Route>
					<Route path='/about' element={<About />}></Route>
					<Route path='/hook-form' element={<HookForm />}></Route>
					<Route path='/error' element={<Error />}></Route>
				</Routes>
			</BrowserRouter>
    </>
  )
}

export default App
