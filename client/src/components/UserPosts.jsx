import { useState, useEffect } from "react";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import UserComments from "./UserComments";

function UserPosts({ comments, deletedComment, setComments, id, deletedPost, post, user, currentUser }) {
    const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
    const [comment, setComment] = useState({ content: "", user_id: user.id, post_id: id })
    useEffect(() => {
        setIsCurrentUserPost(currentUser && currentUser.id === user.id);
    }, [currentUser, user]);

    const commentfilter = comments.filter((com) => com.post_id === id)
    const commentsList = commentfilter.map((comment) => {
        return <UserComments
            key={comment.id}
            content={comment.content}
            user={comment.user}
            id={comment.id}
            currentUser={currentUser}
            deletedComment={deletedComment}
        />
    })

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dakv6swek'
        }
    });

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

    const profilePic = cld.image(user.profile_picture);
    const commentPic = cld.image(currentUser?.profile_picture)

    profilePic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));
    commentPic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));
    
    function handleDelete(id) {
        deletedPost(id)
        fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        })
    }

    function handleContentChange(e) {
        setComment({ ...comment, content: e.target.value });
      }

    return (
        <div>
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
                <h2 className="post-name">{user.name}</h2>
                <p className="post-content">{post.content}</p>
                <div className="delete-btn-wrap">
                    <button onClick={() => handleDelete(id)} className="delete-btn3">
                        <img className="delete-btn-img" src="/src/images/delete.png" />
                    </button>
                </div>
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
                            <textarea value={comment.content} className="comment-textarea" onChange={handleContentChange} placeholder="Write a comment..." />
                            <button className="comment-submit" type="submit">
                                <img className="comment-submit-img" src="/src/images/paper-plane.png" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPosts