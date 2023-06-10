import { NavLink } from "react-router-dom"
import Login from "./Login"

function LandingPage(){
    return(
        <div className="login-button">
            <div>
                <Login/>
            </div>
        </div>
    )
}

export default LandingPage