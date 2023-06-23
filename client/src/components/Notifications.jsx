import React, { useEffect, useState } from 'react';

function Notifications({ users, friends, notifFriends }) {
  const [notifications, setNotifications] = useState([]);
  const [request, setRequest] = useState({ status: "", user_id: users.id })
  const [request2, setRequest2] = useState({status: "", user_id: friends.id})
console.log(notifFriends)
  useEffect(() => {
    fetch(`/api/notifications/${users.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setNotifications(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  function acceptFriendRequest(friend_id, id, user_id) {
    console.log(friend_id)
    fetch(`/api/friends/${friend_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    })
      .then(res => res.json())
      .then(data => setRequest(data))
    console.log(user_id)
    fetch(`/api/friends/${friend_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    })
      .then(res => res.json())
      .then(data => setRequest2(data))


    setNotifications(notifications.filter((notification) => notification.id !== id))
    fetch(`/api/notifications/${id}`, {
      method: 'DELETE'
    })
  };

  return (
    <div className='notif-page'>
      {notifications.length === 0 ? (
        <h3 className='no-notifs'>You have no notifications</h3>
      ) : (
        notifications.map(notification => (
          <div className='notif-wrapper-wrapper' key={notification.id}>
            <div className='notif-wrapper'>
              <p className='notif-msg'>{notification.message}</p>
              <h3 className='notif-name'>{notification.sender.name}</h3>
              <button
                className='notif-btn'
                onClick={() => acceptFriendRequest(notification.friendship_id, notification.id)}
              >
                Accept
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;

