import React, { useEffect, useState } from 'react';

function Notifications({ users, setRequest, setRequest2 }) {
  const [notifications, setNotifications] = useState([]);

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

  function acceptFriendRequest(friend_id, id) {

    fetch(`/api/friends/${friend_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' })
    })
      .then(res => res.json())
      .then(data => {
        setRequest(data)
        setRequest2(data)
      })

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
              <div className='notif-btn-wrap'>
                <button
                  className='notif-btn'
                  onClick={() => acceptFriendRequest(notification.friendship_id, notification.id)}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;

