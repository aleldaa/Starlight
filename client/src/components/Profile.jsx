import { useState, useEffect, useRef } from "react"
import UploadWidget from "./UploadWidget"
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"
import UserPosts from "./UserPosts";

function Profile({ users, posts, setPosts }) {

    const [post, setPost] = useState({ title: "", content: "", user_id: users.id })

    const reversedPosts = posts ? Array.from(posts).reverse() : [];
    const currentUserPosts = reversedPosts.filter((post) => post.user_id === users.id);
    const postList = currentUserPosts?.map((post) => {
        return <UserPosts
            key={post.id}
            post={post}
            user={post.user}
        />;
    });

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dakv6swek'
        }
    });

    const profilePic = cld.image('v1686795150/lszig7lptnj0ct4y1lsh.jpg');
    const banner = cld.image('v1686842791/hxuugcccsxu9fqlrmj5r.jpg')

    profilePic.resize(fill().width(100).height(100));
    banner.resize(fill().width(468).height(100));

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
                    <AdvancedImage className='banner' cldImg={banner} />
                </div>
                <div className="name-pic">
                    <div>
                        <UploadWidget />
                    </div>
                    <div className="profile-pic-wrapper">
                        <AdvancedImage className='profile-pic' cldImg={profilePic} />
                    </div>
                    <div className="profile-name-wrapper">
                        <h1 className="profile-name">{users.name}</h1>
                    </div>
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

                <div>{postList}
                </div>

            </div>
        </div>
    )
}

export default Profile