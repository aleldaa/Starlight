import { NavLink } from "react-router-dom"
import Login from "./Login"

function LandingPage({setUsers}){
    return(
        <div className="login-button">
            <div>
                <Login setUsers={setUsers}/>
            </div>
        </div>
    )
}

export default LandingPage