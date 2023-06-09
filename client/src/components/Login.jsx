import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({setUsers}){
    // const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault();
        fetch('/api/login', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password})
        })
        .then(res => res.json())
        .then(data => {setUsers(data)
        navigate('/home')})

    }

    function handleUsername(e){
        setUsername(e.target.value)
    }

    function handlePassword(e){
        setPassword(e.target.value)
    }
    return(
        <div className='login-route-wrapper'>
            <div className='login-route'>
                <form className='login-route-form' onSubmit={handleSubmit}>
                    <div className='member-login'>
                        <h5>Member Login</h5>
                    </div>
                    <div className='login-route-title'>
                        <h5>Username:</h5>    
                        <input className='login-route-input' type='text' value={username} onChange={handleUsername} />
                    </div>
                    <div className='login-route-title'>  
                        <h5>Password:</h5>  
                        <input className='login-route-input' type='password' value={password} onChange={handlePassword}/>
                    </div>
                    <br></br>
                    <button className='login-route-button' type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login