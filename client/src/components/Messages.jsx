import React, { useState, useEffect } from 'react';

function Messages(){

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = () => {
        fetch('/api/messages')
        .then (r => r.json())
        .then(data => setMessages(data))
    };

    const sendMessage = (newMessage) => {
        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage),
        })
        .then(fetchMessages)
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const sender = e.target.sender.value;
        const receiver = e.target.receiver.value;
        const content = e.target.receiver.value;
        const subject = e.target.subject.value;

        const newMessage = {
            sender,
            receiver,
            content,
            subject,
        };

        sendMessage(newMessage);

        e.target.reset();
    }


    return(
        <>
        Welcome to your inbox!
        </>
    )
}

export default Messages