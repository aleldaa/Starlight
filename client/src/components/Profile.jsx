import { useState, useEffect, useRef } from "react"
import UploadWidget from "./UploadWidget"
import UploadWidget2 from "./UploadWidget2"
import UserPosts from "./UserPosts";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

function Profile({ setFriend, setUsers, setComments, comments, deletedPost, deletedComment, users, posts, setPosts, friendsList }) {

  const [post, setPost] = useState({ title: "", content: "", user_id: users.id })
  const [friends, setFriends] = useState({ user_friend: '' })
  const [bannerUrl, setBannerUrl] = useState(users.banner_picture);
  const [profilePicUrl, setProfilePicUrl] = useState(users.profile_picture);

  const reversedPosts = posts ? Array.from(posts).reverse() : [];
  const currentUserPosts = reversedPosts.filter((post) => post.user_id === users.id);
  const postList = currentUserPosts?.map((post) => {
    return <UserPosts
      key={post.id}
      post={post}
      user={post.user}
      id={post.id}
      deletedPost={deletedPost}
      setComments={setComments}
      comments={comments}
      deletedComment={deletedComment}
    />;
  });

  useEffect(() => {
    if (users.users.length !== 0) {
      fetch(`/api/friends/${users.users[0].id}`)
        .then(res => res.json())
        .then(data => {
          setFriends(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [])

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dakv6swek'
    }
  });

  const friendProfile = friendsList.map((friend) => {
    let proImage = friend.friend_id === users.id ? friend.user_friend.profile_picture : friend.user_user.profile_picture
    return (
      <AdvancedImage
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = '/images/profile-pic-default.png';
        }}
        className='profile-friend-pic'
        cldImg={cld.image(proImage)}
      />
    )
  })

  const friendPic = cld.image(friends.user_friend.profile_picture)
  friendPic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));

  const dialogRef = useRef(null);

  const handleShowDialog = () => {
    dialogRef.current.showModal();
  };

  function onClose() {
    dialogRef.current.close();
  }

  function handleSubmit(e) {
    e.preventDefault()
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
      .then(res => res.json())
      .then(data => {
        setPosts(prevPostData => [...prevPostData, data])
      })
  }

  function handleContentChange(e) {
    setPost({ ...post, content: e.target.value });
  }

  return (
    <div>
      <div className="profile-page">
        <div className="banner-wrapper">
          <div className="banner-div">
            <AdvancedImage
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/images/upload_default.jpg';
              }}
              className='banner'
              cldImg={cld.image(bannerUrl).resize(fill().width(900).height(300))}
            />
            <UploadWidget2 setBannerUrl={setBannerUrl} users={users} />
          </div>
        </div>
        <div className="name-pic">
          <div>
            <UploadWidget setFriends={setFriend} setComments={setComments} setPosts={setPosts} setUsers={setUsers} setProfilePicUrl={setProfilePicUrl} users={users} />
          </div>
          <div className="profile-pic-wrapper">
            <AdvancedImage
              className='profile-pic'
              cldImg={cld.image(profilePicUrl).resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())))}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/images/profile-pic-default.png';
              }} />
          </div>
        </div>
        <div className="profile-name-wrapper">
          <h1 className="profile-name">{users.name}</h1>
        </div>
        <dialog ref={dialogRef} className="favDialog">
          <button className='cancel-btn-wrap' onClick={onClose}>
            <img className='cancel-btn' src='/images/cancel.png' />
          </button>
          <div className='post-name'>
            <h1>{users.name}</h1>
          </div>
          <form className='post-form' onSubmit={handleSubmit}>
            <textarea className='post-textarea' onChange={handleContentChange} placeholder='Write your post...' />
            <button onClick={onClose} type='submit' className="submit-btn">
              Submit
            </button>
          </form>
        </dialog>
        <div className='post-title-wrapper2'>
          <div className="post-title2" onClick={handleShowDialog}>
            <h5>Anything on your mind?</h5>
          </div>
        </div>
        <div className="friends-on-profile-wrap">
          <div className="friends-on-profile">
            <div className="friend-title-wrap">
              <h3 className="friend-title">Friends</h3>
            </div>
            {users.users[0] ?
              <div className="profile-friend-pic-wrap">
                {friendProfile}
              </div> :
              <div className="loser">Lmao loser go get some friends</div>
            }
          </div>
        </div>
        <div className="post-list2">
          {postList}
        </div>
      </div>
    </div>
  )
}

export default Profile