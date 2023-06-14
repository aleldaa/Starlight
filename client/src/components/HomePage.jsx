import React, { useState, useRef } from 'react';
import Posts from './Posts';

function HomePage({posts, users, setPosts}) {

    const [post, setPost] = useState({title: "", content: "", user_id: users.id})
    const reversedPosts = posts ? Array.from(posts).reverse() : [];

    const dialogRef = useRef(null);

    const postList = reversedPosts?.map((post) => {
        return <Posts 
            key={post.id} 
            title={post.title} 
            content={post.content}
            user={post.user}
            currentUser={users}
            profilePic={users.profile_picture}
        />;
        });

    const handleShowDialog = () => {
        dialogRef.current.showModal();
    };

    function handleSubmit(e){
        e.preventDefault()
        fetch('/api/posts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(post)
        })
        .then(res=>res.json())
        .then(data=>{
            setPosts(prevPostData => [...prevPostData, data])
        })
    }

    function handleContentChange(e) {
        setPost({ ...post, content: e.target.value });
        }

    return (
        <div>
            <div className='homepage-wrapper'>
                <dialog ref={dialogRef} className="favDialog">
                    <div className='post-name'>
                        <h1>{users.name}</h1>
                    </div>
                    <form className='post-form' onSubmit={handleSubmit}>
                        <textarea className='post-textarea' onChange={handleContentChange} placeholder='Write your post'/>
                        <button type='submit' className="submit-btn">
                            Submit
                        </button>
                    </form>
                    <h5 className='esc'>(Esc to exit)</h5>
                </dialog>
                <div className='post-title-wrapper'>
                    <div className="post-title" onClick={handleShowDialog}>
                        <h5>What fuels your ✨sparkle✨ today?</h5>
                    </div>
                </div>
                <div className='post-list'>
                    <p className='post-p'>{postList}</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;


