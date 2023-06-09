import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout({setUsers}){

    const navigate = useNavigate()

    function handleLogout(e){
        e.preventDefault()
        fetch('/api/logout', {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        })
        .then(setUsers(null), navigate('/'))
    }


    return(
        <div className='logout'>
            <form onSubmit={handleLogout}>
                <button type='submit' className='logout-button'>Logout</button>
            </form>
        </div>
    )
}

export default Logout