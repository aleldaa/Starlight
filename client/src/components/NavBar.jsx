import { NavLink } from "react-router-dom"

function NavBar(){
    return(
        <nav className="navbar">
            <div className="header">
                <div className='main-title'>
                <img className='logo' src="https://icons.iconarchive.com/icons/google/noto-emoji-activities/512/52705-sparkles-icon.png"/>
                    {/* <h1>Starlight</h1> */}
                </div>
            </div>
            <div>
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