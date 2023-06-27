import { useState, useEffect } from "react";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import Comments from "./Comments";


function Posts({id, content, user, currentUser, deletedPost }) {
  const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState({ content: "", user_id: currentUser.id, post_id: id })

  
  const commentfilter = comments.filter((com) => com.post_id === id)
  const commentsList = commentfilter.map((comment) => {
    return <Comments
      key={comment.id}
      content={comment.content}
      user={comment.user}
      id={comment.id}
      currentUser={currentUser}
      deletedComment={deletedComment}
    />
  })

  function deletedComment(newComment){
    const allComments = comments.filter(comment => comment.id !== newComment);
    setComments(allComments)
  }

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
        setComment({ ...comment, content: "" })
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
    deletedPost(id)
    fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    })
  }

  function handleContentChange(e) {
    setComment({ ...comment, content: e.target.value });
  }

  const commentPic = cld.image(currentUser.profile_picture)
  const profilePic = cld.image(user.profile_picture);

  profilePic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));
  commentPic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));

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
          <AdvancedImage
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/src/images/profile-pic-default.png';
            }}
            className='comment-pic2'
            cldImg={commentPic}
          />
            <form className="comment-form" onSubmit={handleSubmit}>
              <textarea  value={comment.content} className="comment-textarea" onChange={handleContentChange} placeholder="Write a comment..." />
              <button className="comment-submit" type="submit">
                <img className="comment-submit-img" src="/src/images/paper-plane.png"/>
              </button>
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