import { useState, useEffect } from "react";

function Posts({ profilePic, title, content, user, currentUser }) {
    const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);

  useEffect(() => {
    setIsCurrentUserPost(currentUser && currentUser.id=== user.id);
  }, [currentUser, user]);

  return (
    <div className="posts">
        <div className="post-body">
            <div className="post-pic-wrapper">
                <img src={user.profile_picture} className="post-pic"/>
            </div>
            <h5 className="post-name">{user.name}</h5>
            <h4 className="post-content">{content}</h4>
        </div>
    </div>
  );
}

export default Posts;