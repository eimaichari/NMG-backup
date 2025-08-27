//import './App.css'
import AppRouter from './AppRouter/index'
import CustomCursor from './components/CustomCursor/CustomCursor'

function App() {

  return (
    <div className='app-container'>
      <CustomCursor/>
        <AppRouter />
    </div>
  )
}

export default App
