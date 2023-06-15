function FriendsList({friend}){

    return(
        <div className="friend-wrap">
            <div className="friend">
                <img className="friend-pic" src={friend.profile_picture}/>
                <div>
                    <h5 className="friend-name">{friend.name}</h5>
                    <h6 className="friend-username">{friend.username}</h6>
                </div>
            </div>
        </div>
    )
}

export default FriendsList