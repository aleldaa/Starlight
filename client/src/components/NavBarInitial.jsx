import { NavLink } from "react-router-dom"

function NavBarInitial(){
    return(
        <nav>
        <div className="header">
            <div className='main-title'>
                <h1>Starlight</h1>
            </div>
            <div className="login-button">
                <li><NavLink to='/signup' className='signuplink'>Sign Up</NavLink></li>
                <li><NavLink to='/login' className='loginlink'>Login</NavLink></li>
            </div>
        </div>
    </nav>
    )
}

export default NavBarInitial