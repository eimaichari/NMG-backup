import { useState } from 'react'
//import './App.css'
import router from './AppRouter/index'
import AppRouter from './AppRouter/index'
import Footer from './components/Footer/Footer'
import NavBar from './components/NavBar/NavBar'

// test
import HomePage from './pages/HomePage/HomePage'

function App() {

  return (
    <div className='app-container'>
        <AppRouter />
    </div>
  )
}

export default App
