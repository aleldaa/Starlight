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
import Notifications from './components/Notifications'


function App() {

  const [page, setPage] = useState('/')
  const [users, setUsers] = useState(null)
  const [posts, setPosts] = useState([])
  const [friends, setFriends] = useState([])

  const updateUser = (user) => setUsers(user)

  function deletedPost(newPost){
    const allPosts = posts.filter(post => post.id !== newPost);
    console.log(allPosts)
    setPosts(allPosts)

  }
  
  useEffect(()=>{
    fetch('/api/users')
      .then(res=>res.json())
      .then(data=>setFriends(data))
  }, [])

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

  console.log(users)

  const notifFriends = users?.friends.filter((friend)=> friend.user_id === users.id)
  const friendsList = users?.friends.filter((friend) => friend.status === 'accepted')
  const additionalAccepted = users?.users.filter((friend) => friend.status === 'accepted')
  const allFriends = friendsList?.concat(additionalAccepted)
  console.log(allFriends)
  console.log(notifFriends)

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
        <Route path='/home' element={<HomePage deletedPost={deletedPost} users={users} posts={posts} setPosts={setPosts}/>} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/profile' element={<Profile friendsList={allFriends} setPosts={setPosts} users={users} posts={posts} friends={friends}/>} />
        <Route path='/friends' element={<Friends friends={friends} users={users}/>} />
        <Route path='/music' element={<Music />} />
        <Route path='/notifications' element={<Notifications notifFriends={notifFriends} friends={friends} users={users}/>}/>
      </Routes>
    </div>
  )
}

export default App