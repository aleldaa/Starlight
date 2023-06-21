import { useState, useEffect } from "react";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"

function UserPosts({ post, user, currentUser }) {
    const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
    useEffect(() => {
        setIsCurrentUserPost(currentUser && currentUser.id === user.id);
    }, [currentUser, user]);

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dakv6swek'
        }
    });

    const profilePic = cld.image(user.profile_picture);

    profilePic.resize(fill().width(100).height(100));


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
            </div>
        </div>
    )
}

export default UserPosts