function ProfileFriends({friends}){
    const acceptedFriends = friends.filter(friend => friend.status == 'accepted')
    console.log(acceptedFriends[0])
    return(
        <div>
            <div>
                {/* {acceptedFriends[0]?.user_id} */}
            </div>
        </div>
    )
}

export default ProfileFriends