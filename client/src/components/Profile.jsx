function Profile({users}){
    return(
        <div>
            <img src={users.profile_picture} placeholder="profile picture"/>
        </div>
    )
}

export default Profile