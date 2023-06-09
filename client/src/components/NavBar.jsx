import { NavLink } from "react-router-dom"

function NavBar(){
    return(
        <nav>
            <div className="header">
                <div className='main-title'>
                    <h1>Schmy Space</h1>
                </div>
                <div className="login-button">
                    <li><NavLink to='/logout' className='loginlink'>Logout</NavLink></li>
                </div>
            </div>
            <div className="navbar-elements">
                <ul>
                    <li><NavLink to="/home" className='navLink'>Home</NavLink></li>
                    <li><NavLink to="/browse" className='navLink'>Browse</NavLink> </li>
                    <li><NavLink to='/search' className='navLink'>Search</NavLink></li>
                    <li><NavLink to='/messages'>Messages</NavLink></li>
                    <li><NavLink to='/blog' className='navLink'>Blog</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar