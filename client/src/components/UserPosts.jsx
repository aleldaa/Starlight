import { useState, useEffect } from "react";

function UserPosts({ post, user, currentUser }) {
    const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
    useEffect(() => {
        setIsCurrentUserPost(currentUser && currentUser.id === user.id);
    }, [currentUser, user]);

    return (
        <div>
            <div className="post-body">
                <div className="post-pic-wrapper">
                    <img src={user.profile_picture} className="post-pic" />
                </div>
                <h2 className="post-name">{user.name}</h2>
                <p className="post-content">{post.content}</p>
            </div>
        </div>
    )
}

export default UserPosts