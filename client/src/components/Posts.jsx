import { useState, useEffect } from "react";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import Comments from "./Comments";
import { data } from "jquery";

function Posts({ id, content, user, currentUser, deletedPost }) {
  const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState({ content: "", user_id: user.id, post_id: })

  const commentsList = user.comments.map((comment) => {
    return <Comments
      key={comment.id}
      content={comment.content}
      user={user}
    />
  })

  function handleSubmit(e) {
    e.preventDefault()
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    })
      .then(res => res.json())
      .then(data => {
        setComments(prevCommentData => [...prevCommentData, data])
      })
  }

  useEffect(() => {
    fetch('/api/comments')
      .then(res => res.json())
      .then(data => setComments(data))
  }, [])

  useEffect(() => {
    setIsCurrentUserPost(currentUser && currentUser.id === user.id);
  }, [currentUser, user]);

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dakv6swek'
    }
  });

  function handleDelete(id) {
    console.log(id)
    deletedPost(id)
    fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    })
  }

  function handleContentChange(e) {
    setComment({ ...comment, content: e.target.value });
  }

  const profilePic = cld.image(user.profile_picture);

  profilePic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));

  return (
    <div className="posts">
      <div className="post-body">
        <div className="post-pic-wrapper">
          <AdvancedImage
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/src/images/profile-pic-default.png';
            }}
            className='post-pic'
            cldImg={profilePic}
          />
        </div>
        <h5 className="post-name">{user.name}</h5>
        <h4 className="post-content">{content}</h4>
        {isCurrentUserPost && (
          <div className="delete-btn-wrap">
            <button onClick={() => handleDelete(id)} className="delete-btn">
              <img className="delete-btn-img" src="/src/images/delete.png" />
            </button>
          </div>
        )}
        <div className="comments">
          {commentsList}
          <div className="comment-form-wrap">
            <form className="comment-form" onSubmit={handleSubmit}>
              <textarea onSubmit={handleContentChange} placeholder="Write a comment..." />
              <button className="comment-submit" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
  );
}

export default Posts;