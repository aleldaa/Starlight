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

    // console.log(notifications);

    // const markAsRead = (notificationId) => {
    //     fetch(`/api/notifications/mark-read/${notificationId}`, {
    //         method: 'PATCH',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ status: 'read' })
    //     })
    //         .then(response => {
    //             if (response.ok) {
    //                 setNotifications(prevNotifications => {
    //                     return prevNotifications.map(notification => {
    //                         if (notification.id === notificationId) {
    //                             return { ...notification, status: 'read' };
    //                         }
    //                         return notification;
    //                     });
    //                 });
    //             } else {
    //                 console.error('Failed to mark notification as read');
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Failed to mark notification as read:', error);
    //         });
    // };

    function acceptFriendRequest(id) {
        fetch('/api/friend-requests/accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
            .then(res => res.json())
            .then(data => {
                setRequest(prevRequestData => [...prevRequestData, data])
            })

        fetch(`/api/friends/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'accepted' })
        })
            .then(res=>res.json())
            .then(data=>console.log(data))
    };


return (
    <div>
        <h1>Notifications</h1>
        {notifications.map(notification => (
            <div key={notification.id}>
                <h3>{notification.sender.name}</h3>
                <p>{notification.message}</p>
                <button onClick={acceptFriendRequest}>Accept Request</button>
            </div>
        ))}
    </div>
);
}

export default Notifications;

