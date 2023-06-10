import { useEffect, useState } from 'react'
import './App.css'
import { Route } from 'react-router'
import { Routes } from 'react-router-dom'

import NavBar from './components/NavBar'
import Login from './components/Login'
import SignUp from './components/SignUp'
import NavBarInitial from './components/NavBarInitial'
import HomePage from './components/HomePage'
import Logout from './components/Logout'
import LandingPage from './components/LandingPage'


function App() {

  const [page, setPage] = useState('/')
  const [users, setUsers] = useState(null)

  const updateUser = (user) => setUsers(user)

  useEffect(()=>{
    fetch('/api/check_session')
    .then(res=>res.json())
    .then(data => setUsers(data))
  }, [])

  if(!users) return(
    <div className='body'>
    <NavBarInitial onChangePage={setPage} />
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signup' element={<SignUp updateUser={updateUser}/>}/>
      <Route path='/login' element={<Login setUsers={setUsers}/>}/>
    </Routes>
    </div>
  )
  return (
    <div className='body'>
      <NavBar onChangePage={setPage}/>
      <Routes>
        <Route path="/logout" element={<Logout setUsers={setUsers}/>}/>
        <Route path='/home' element={<HomePage/>}/>
      </Routes>
    </div>
  )
  }

  export default App