import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className='bg-gradient-to-br from-green-600 to-red-600 w-full min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-2xl bg-green-400/70 bg-clip-padding min-h-[640px] rounded-lg shadow-lg backdrop-blur-lg overflow-hidden'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomeScreen />}/>
            <Route path="play" element={<></>} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
