import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Routes from './Router/Routes'

function App() {

  return (
		<>
			<BrowserRouter future={{
				v7_startTransition: true,
			}}>
				<Routes />
			</BrowserRouter>
    </>
  )
}

export default App
