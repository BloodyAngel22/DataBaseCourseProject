import { BrowserRouter } from 'react-router-dom'
import './App.css'
import NavBar from './Router/NavBar'
import Routes from './Router/Routes'

function App() {

  return (
		<>
			<BrowserRouter future={{
				v7_startTransition: true,
			}}>
				<NavBar />
				<Routes />
			</BrowserRouter>
    </>
  )
}

export default App
