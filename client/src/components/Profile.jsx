import { useState, useEffect, useRef } from "react"
import UploadWidget from "./UploadWidget"
import UploadWidget2 from "./UploadWidget2"
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"
import UserPosts from "./UserPosts";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

function Profile({ users, posts, setPosts }) {

    const [post, setPost] = useState({ title: "", content: "", user_id: users.id })
    const [friends, setFriends] = useState({ user_friend: '' })

    const reversedPosts = posts ? Array.from(posts).reverse() : [];
    const currentUserPosts = reversedPosts.filter((post) => post.user_id === users.id);
    const postList = currentUserPosts?.map((post) => {
        return <UserPosts
            key={post.id}
            post={post}
            user={post.user}
        />;
    });
    console.log(friends.user_friend)

    useEffect(() => {
        fetch(`/api/friends/${users.users[0].id}`)
            .then(res => res.json())
            .then(data => {
                setFriends(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dakv6swek'
        }
    });

    const profilePic = cld.image(users.profile_picture);
    const friendPic = cld.image(friends.user_friend.profile_picture)
    const banner = cld.image('v1686842791/hxuugcccsxu9fqlrmj5r.jpg')

    profilePic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));
    friendPic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));
    banner.resize(fill().width(900).height(300))

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
                            className='banner' 
                            cldImg={banner}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = '/src/images/upload_default.jpg';
                            }}
                        />
                        <UploadWidget2 users={users} />
                    </div>
                </div>
                <div className="name-pic">
                    <div>
                        <UploadWidget users={users} />
                    </div>
                    <div className="profile-pic-wrapper">
                        <AdvancedImage className='profile-pic' cldImg={profilePic} onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = '/src/images/profile-pic-default.png';
                        }} />
                    </div>
                </div>
                <div className="profile-name-wrapper">
                    <h1 className="profile-name">{users.name}</h1>
                </div>
                <dialog ref={dialogRef} className="favDialog">
                    <button className='cancel-btn-wrap' onClick={onClose}>
                        <img className='cancel-btn' src='/src/images/cancel.png' />
                    </button>
                    <div className='post-name'>
                        <h1>{users.name}</h1>
                    </div>
                    <form className='post-form' onClick={onClose} onSubmit={handleSubmit}>
                        <textarea className='post-textarea' onChange={handleContentChange} placeholder='Write your post' />
                        <button type='submit' className="submit-btn">
                            Submit
                        </button>
                    </form>
                    <h5 className='esc'>(Esc to exit)</h5>
                </dialog>
                <div className='post-title-wrapper2'>
                    <div className="post-title2" onClick={handleShowDialog}>
                        <h5>Anything on your mind?</h5>
                    </div>
                </div>
                <div>
                    <div>
                        <AdvancedImage
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = '/src/images/profile-pic-default.png';
                            }}
                            className='post-pic'
                            cldImg={friendPic}
                        />
                        <h3>{friends?.user_friend.name}</h3>
                    </div>
                </div>
                <div>
                    {postList}
                </div>
            </div>
        </div>
    )
}

export default Profile