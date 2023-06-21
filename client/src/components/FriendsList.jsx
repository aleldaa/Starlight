import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"

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

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dakv6swek'
    }
  });

  const profilePic = cld.image(friend.profile_picture);

  profilePic.resize(fill().width(100).height(100));


  return (
    <div className="friend-wrap">
      <div className="friend">
        <AdvancedImage
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = '/src/images/profile-pic-default.png';
          }}
          className='friend-pic'
          cldImg={profilePic}
        />
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