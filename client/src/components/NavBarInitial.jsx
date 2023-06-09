import { NavLink } from "react-router-dom"

function NavBarInitial(){
    return(
        <nav>
        <div className="header">
            <div className='main-title'>
                <h1>Schmy Space</h1>
            </div>
            <div className="login-button">
                <li><NavLink to='/signup' className='signuplink'>Sign Up</NavLink></li>
                <li><NavLink to='/login' className='loginlink'>Login</NavLink></li>
            </div>
        </div>
        <div className="navbar-elements">
            <ul>
                <li><NavLink to="/" className='navLink'>Home</NavLink></li>
                <li><NavLink to="/browse" className='navLink'>Browse</NavLink> </li>
                <li><NavLink to='/search' className='navLink'>Search</NavLink></li>
            </ul>
        </div>
    </nav>
    )
}

export default NavBarInitial