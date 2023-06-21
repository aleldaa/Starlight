import { useState, useEffect } from "react";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";

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

    profilePic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));


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