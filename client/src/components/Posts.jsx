import { useState, useEffect } from "react";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import Comments from "./Comments";


function Posts({ deletedLike, likes, setLikes, posts, id, content, user, currentUser, deletedPost, deletedComment, comments, setComments }) {
  const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
  const [comment, setComment] = useState({ content: "", user_id: currentUser.id, post_id: id })
  const [favorite, setFavorite] = useState(true)
  const [like, setLike] = useState({ status: true,  post_id: id, user_id: currentUser.id})

  function handleClick() {
    setFavorite(!favorite)

  }

  function handleLikePost(){
    fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(like)
  })
      .then(res => res.json())
      .then(data => {
         console.log(data)
          // setLike({ ...like, status: "" })
      })
  }
  console.log(likes)
  function handleLikeDelete(id){
    deletedLike(likes.id)
    console.log(likes.id)
    fetch(`/api/likes/${likes.id}`,{
      method: "DELETE"
    })
  }
  

  const commentfilter = comments.filter((com) => com.post_id === id)
  const likesFilter = likes.filter((li)=>console.log(li))

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
    setIsCurrentUserPost(currentUser && currentUser.id === user.id);
  }, [currentUser, user]);

  function handleDelete(id) {
    deletedPost(id)
    fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    })
  }

  function handleContentChange(e) {
    setComment({ ...comment, content: e.target.value });
  }

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dakv6swek'
    }
  });
  const commentPic = cld.image(currentUser.profile_picture)
  const profilePic = cld.image(user.profile_picture);

  profilePic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));
  commentPic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));

  return (
    <div className="posts">
      <div className="post-body">
        <div className="post-pic-wrapper">
          {isCurrentUserPost && (
            <div className="delete-btn-wrap">
              <button onClick={() => handleDelete(id)} className="delete-btn">
                <img className="delete-btn-img" src="/images/delete.png" />
              </button>
            </div>
          )}
          <AdvancedImage
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/images/profile-pic-default.png';
            }}
            className='post-pic'
            cldImg={profilePic}
          />
        </div>
        <h5 className="post-name">{user.name}</h5>
        <h4 className="post-content">{content}</h4>
        {favorite ? (
          <button onClick={()=>{handleClick(); handleLikePost()}} className="like-btn">
            <img className="like-btn-heart" src="/images/heart.png" />
          </button>
        ) : (
          <button onClick={()=>{handleClick(); handleLikeDelete()}} className="like-btn2">
            <img className="like-btn-heart" src="/images/heart.png" />
          </button>
        )}
        <div className="comments">
          {commentsList}
          <div className="comment-form-wrap">
            <AdvancedImage
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/images/profile-pic-default.png';
              }}
              className='comment-pic2'
              cldImg={commentPic}
            />
            <form className="comment-form" onSubmit={handleSubmit}>
              <textarea value={comment.content} className="comment-textarea" onChange={handleContentChange} placeholder="Write a comment..." />
              <button className="comment-submit" type="submit">
                <img className="comment-submit-img" src="/images/paper-plane.png" />
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