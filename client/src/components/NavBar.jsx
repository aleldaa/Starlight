import { NavLink } from "react-router-dom"

function NavBar(){
    return(
        <nav>
            <div className="header">
                <div className='main-title'>
                    <h1>Starlight</h1>
                </div>
                <div className="login-button">
                    <li><NavLink to='/logout' className='loginlink'>Logout</NavLink></li>
                </div>
            </div>
            <div className="navbar-elements">
                <ul>
                    <li><NavLink to="/home" className='navLink'>Home</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar