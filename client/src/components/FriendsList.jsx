function FriendsList({ friend, users }) {
    function handleClick() {
      const request = {
        sender_id: users.id,
        recipient_id: friend.id
      };

      fetch('/api/friend-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })
        .then(response => {
          if (response.ok) {
            console.log('Friend request sent');
          } else {
            console.error('Failed to send friend request');
          }
        })
        .catch(error => {
          console.error('Error occurred:', error);
        });
    }
  
    return (
      <div className="friend-wrap">
        <div className="friend">
          <img className="friend-pic" src={friend.profile_picture} alt="Friend Profile" />
          <div>
            <h5 className="friend-name">{friend.name}</h5>
            <h6 className="friend-username">{friend.username}</h6>
          </div>
          <div>
            <button onClick={handleClick} className="friend-btn-wrap">
              <img className="friend-btn" src="/src/images/add-user.png" alt="Add Friend" />
            </button>
            {/* <button className="friend-btn-wrap">
              <img className="friend-btn" src="/src/images/remove-user.png" alt="Remove Friend" />
            </button> */}
          </div>
        </div>
      </div>
    );
  }
  
  export default FriendsList;