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
import Messages from './components/Messages'
import Profile from './components/Profile'
import Friends from './components/Friends'
import Music from './components/Music'


function App() {

  const [page, setPage] = useState('/')
  const [users, setUsers] = useState(null)
  const [posts, setPosts] = useState([])
  // const [artist, setArtist] = useState([])

  const updateUser = (user) => setUsers(user)

  useEffect(() => {
    const data = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "7952c26319fe4f2f8c158255b18509fc",
      client_secret: "db769497eec94f00962753212668c77c"
    });
    fetch("https://accounts.spotify.com/api/token", {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data
    })
      .then(res => res.json())
      .then(data => {
        const access_token = data.access_token
        console.log("Access Token:", access_token)
      })
  }, [])

  // useEffect(()=>{
  //   fetch("https://api.spotify.com/search", {
  //     method: "GET",
  //     headers: {'Authorization': 'Bearer BQCZQe4tPXNvMdFjjhGUaIik8sFZ5bi8XV0tff-UiNgHnsTpDblqk1IOJNYkvFDHsxrLGpUhkn923dJnYfG4Z_IR7X1qsPWVEeqMKqzuEjjdXXvNuRA'}
  //   })
  //   .then(res=>res.json())
  //   .then(data => setArtist([data]))
  // }, [])

  useEffect(()=>{
    fetch('/api/posts')
      .then(res=>res.json())
      .then(data=>setPosts(data))
  }, [])

  useEffect(() => {
    fetch('/api/check_session')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  if (!users) return (
    <div className='body'>
      <NavBarInitial onChangePage={setPage} />
      <Routes>
        <Route path='/' element={<LandingPage setUsers={setUsers} />} />
        <Route path='/signup' element={<SignUp updateUser={updateUser} />} />
        <Route path='/login' element={<Login setUsers={setUsers} />} />
      </Routes>
    </div>
  )
  return (
    <div className='body'>
      <NavBar setUsers={setUsers} onChangePage={setPage} />
      <Routes>
        <Route path="/logout" element={<Logout setUsers={setUsers} />} />
        <Route path='/home' element={<HomePage users={users} posts={posts} setPosts={setPosts}/>} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/profile' element={<Profile users={users}/>} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/music' element={<Music />} />
      </Routes>
    </div>
  )
}

export default App