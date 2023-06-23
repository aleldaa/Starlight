import { useState, useEffect } from "react";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import Comments from "./Comments";
import { data } from "jquery";

function Posts({ id, content, user, currentUser, deletedPost }) {
  const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
  const [comments, setComments] = useState([])

  const commentsList = comments.map((comment)=>{
    // console.log(comment)
    return <Comments
        key={comment.id}
        content={comment.content}
        user={comment.user}
    />
  })

  useEffect(() => {
    fetch('/api/comments')
      .then(res=>res.json())
      .then(data=>setComments(data))
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


  const profilePic = cld.image(user.profile_picture);

  profilePic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));

  return (
    <div className="posts">
      <div className="post-body">
        <div className="post-pic-wrapper">
          <AdvancedImage 
            onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = '/src/images/profile-pic-default.png';}} 
            className = 'post-pic' 
            cldImg = { profilePic } 
          />
        </div>
        <h5 className="post-name">{user.name}</h5>
        <h4 className="post-content">{content}</h4>
        {isCurrentUserPost && (
        <div className="delete-btn-wrap">
          <button onClick={()=>handleDelete(id)} className="delete-btn">
            <img className="delete-btn-img" src="/src/images/delete.png"/>
          </button>
        </div>
        )}
      </div>
      <div>
        <div>
          {commentsList}
        </div>
      </div>
    </div>
  );
}

export default Posts;