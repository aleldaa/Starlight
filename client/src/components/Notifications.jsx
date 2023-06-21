import React, { useEffect, useState } from 'react';

function Notifications({ users }) {
    const [notifications, setNotifications] = useState([]);
    const [request, setRequest] = useState({ status: "", user_id: users.id })

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
        console.log(friend_id)
        fetch(`/api/friends/${friend_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'accepted' })
        })
            .then(res => res.json())
            .then(data => setRequest(data))

        // setNotifications(notifications.filter((notification) => notification.id !== id))
        // fetch(`/api/notifications/${id}`, {
        //     method: 'DELETE'
        // })
    };

    return (
        <div>
            <h1>Notifications</h1>
            {notifications.map(notification => {
                // console.log(notification)
                return(
                <div key={notification.id}>
                    <p>{notification.id}</p>
                    <h3>{notification.sender.name}</h3>
                    <p>{notification.message}</p>
                    <button onClick={() => acceptFriendRequest(notification.friendship_id, notification.id)}>Accept Request</button>
                </div>
            )})}
        </div>
    );
}

export default Notifications;

