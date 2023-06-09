import { useEffect, useState } from 'react'
import './App.css'
import { Route } from 'react-router'
import { Routes } from 'react-router-dom'

import Profile from './components/Profile'
import HomePage from './components/HomePage'
import NavBar from './components/NavBar'
import Messages from './components/Messages'
import Login from './components/Login'
import Browse from './components/Browse'
import Search from './components/Search'
import Blog from './components/Blog'
import SignUp from './components/SignUp'
import Home from './components/Home'
import Logout from './components/Logout'
import NavBarInitial from './components/NavBarInitial'

function App() {

  const [page, setPage] = useState('/')
  const [users, setUsers] = useState(null)
  const [posts, setPosts] = useState(null)

  function deletedPost(newPost){
    const allPosts = posts.filter(post => post.id !== newPost);
    console.log(allPosts)
    setPosts(allPosts)

  }
  console.log(posts)

  const updateUser = (user) => setUsers(user)

  useEffect(()=>{
    fetch('/api/posts')
      .then(res=>res.json())
      .then(data=>setPosts(data))
  }, [])

  useEffect(()=>{
    fetch('/api/check_session')
    .then(res=>res.json())
    .then(data => setUsers(data))
  }, [])

  if(!users) return(
    <div className='body'>
    <NavBarInitial onChangePage={setPage} />
    <Routes>
      <Route path='/' element={<Home setUsers={setUsers}/>} />
      <Route path='/signup' element={<SignUp updateUser={updateUser}/>}/>
      <Route path='/login' element={<Login setUsers={setUsers}/>}/>
    </Routes>
    </div>
  )
  return (
    <div className='body'>
      <NavBar onChangePage={setPage}/>
      <Routes>
        <Route path="/home" element={<HomePage users={users}/>}/>
        <Route path="/logout" element={<Logout setUsers={setUsers}/>}/>
        <Route path='/profile' element={<Profile users={users} />}/>
        <Route path='/browse' element={<Browse/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/blog' element={<Blog posts={posts} users={users} setPosts={setPosts} deletedPost={deletedPost}/>}/>
        <Route path='/messages' element={<Messages/>}/>
      </Routes>
    </div>
  )
  }

  export default App