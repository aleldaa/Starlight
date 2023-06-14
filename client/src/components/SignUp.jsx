import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom"

function SignUp({updateUser}){

    const [signup, setSignup] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault();
        fetch('/api/signup', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: name, username: username, password: password, email: email})
        })
        .then(res => res.json())
        .then(data => {updateUser(data)
        navigate('/home')})
    }

    function handleUsername(e){
        setUsername(e.target.value)
    }

    function handleName(e){
        setName(e.target.value)
    }

    function handleEmail(e){
        setEmail(e.target.value)
    }

    function handlePassword(e){
        setPassword(e.target.value)
    }
    if(signup){
        return(
            <div>
                <h1>User already exists</h1>
            </div>
        )
    }
    else{
        return(
            <div className="signup-wrapper">
                <div className="signup">
                    <form onSubmit={handleSubmit} className="signup-form">
                    <div className='signup-title'>
                            <input placeholder="Name" className='signup-input' type="text" value={name} onChange={handleName}/>
                        </div>
                        <div className='signup-title'>
                            <input placeholder="Username" className='signup-input' type="text" value={username} onChange={handleUsername}/>
                        </div>
                        <div className='signup-title'>
                            <input placeholder="Email" className='signup-input' type="text" value={email} onChange={handleEmail}/>
                        </div>
                        <div className='signup-title'>
                            <input placeholder="Password" className='signup-input' type="password" value={password} onChange={handlePassword}/>
                        </div>
                        <br></br>
                        <button className='signup-button' type="submit">Sign Up!</button>
                    </form>
                    <div className="login-switch">
                        <li><NavLink to='/login' className='loginlink'>Login</NavLink></li>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp