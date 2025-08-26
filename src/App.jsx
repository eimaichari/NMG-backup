import { useState } from 'react'
//import './App.css'
import router from './router/index'
import { RouterProvider } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import NavBar from './components/NavBar/NavBar'

function App() {

  return (
    <div className='app-container'>
      <NavBar />
      <RouterProvider router={router} />
      <Footer />
    </div>
  )
}

export default App
