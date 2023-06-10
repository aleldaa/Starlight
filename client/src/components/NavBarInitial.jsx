import { NavLink } from "react-router-dom"

function NavBarInitial(){
    return(
        <nav>
            <div className="header">
                <div className='init-title'>
                    <h1>Starlight</h1>
                    <img className='logo' src="https://icons.iconarchive.com/icons/google/noto-emoji-activities/512/52705-sparkles-icon.png"/>
                </div>
            </div>
        </nav>
    )
}

export default NavBarInitial