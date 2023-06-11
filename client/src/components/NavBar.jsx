import { NavLink, useNavigate } from "react-router-dom"

function NavBar({setUsers}){

    const navigate = useNavigate()

    function handleClick(e){
        navigate('/home')
    }

    function handleLogout(e){
        e.preventDefault()
        fetch('/api/logout', {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        })
        .then(setUsers(null), navigate('/'))
    }

    return(
        <nav className="navbar">
            <div className="header">
                <div className='main-title'>
                    <img onClick={handleClick} className='logo' src="/src/images/starry-night.png"/>
                    <div className="navbar-elements">
                            <NavLink to="/home" className='navLink'>
                                <img className="home-icon" src='src/images/home.png'/>
                            </NavLink>
                            <NavLink to='/profile' className='navLink'>
                                <img className="profile-icon" src="/src/images/profile.png"/>
                            </NavLink>
                            <NavLink to='/messages' className='navLink'>
                                <img className="message-icon" src="/src/images/chat.png"/>
                            </NavLink>
                    </div>
                    <div className="logout-button">
                        <NavLink onClick={handleLogout} to='/logout' className='logoutlink'>
                            <img src="/src/images/logout.png" className="logout-icon"/>
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar