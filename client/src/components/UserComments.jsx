import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { useState, useEffect } from 'react';

function UserComments({ id, content, user, currentUser, deletedComment }) {
    const [isCurrentUserComment, setIsCurrentUserComment] = useState(false);

    useEffect(() => {
        setIsCurrentUserComment(currentUser && currentUser.id === user.id);
    }, [currentUser, user]);

    function handleDelete(id) {
        console.log(id)
        deletedComment(id)
        fetch(`/api/comments/${id}`, {
            method: 'DELETE'
        })
    }

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dakv6swek'
        }
    });

    const profilePic = cld.image(user.profile_picture);

    profilePic.resize(thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face())));

    return (
        <div className="comment-wrapper">
            <div className="comment">
                <AdvancedImage
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = '/src/images/profile-pic-default.png';
                    }}
                    className='comment-pic'
                    cldImg={profilePic}
                />
                <h5>{user.name}</h5>
                <p>{content}</p>
                    <div className="delete-btn-wrap">
                        <button onClick={() => handleDelete(id)} className="delete-btn">
                            <img className="delete-btn-img" src="/src/images/delete.png" />
                        </button>
                    </div>
            </div>
        </div>
    )
}

export default UserComments