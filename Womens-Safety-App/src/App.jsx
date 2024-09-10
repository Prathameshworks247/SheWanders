import { useState } from 'react'
import React from 'react'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login/>
    </>
  )
}

export default App
