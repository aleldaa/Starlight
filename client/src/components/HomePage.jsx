import React, { useState, useEffect } from "react"
import { NavLink, Route } from "react-router-dom"

function HomePage({ users }){

    function handleSubmit(e){
        e.preventDefault()
        fetch('/api/users')
    }

    return(
        <div className="home-page">
            <div className="profile-prev">
                <h1>Hello, {users.username}!</h1>
                <div>
                    {/* <img src={users.profile_picture} alt='Profile Picture' className="profile-picture"/>
                    <form>
                        <input type='file' name='upload' accept='image/*'/>
                        <br></br>
                        <button type="submit">Add Profile Picture</button>
                    </form> */}
                    
                </div>
            </div>
            <div>
                <h3>Your latest blog entries</h3>
            </div>
            <div>
                <h3>My Mail</h3>
            </div>
            <div>
            <NavLink to='/profile' className='profile-link'>View Your Profile</NavLink>
            </div>
        </div>
    )
}

export default HomePage