import { useEffect, useRef } from "react";

function UploadWidget({ setFriends, setComments, setPosts, setUsers, users, setProfilePicUrl }) {

    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    useEffect(() => {
        cloudinaryRef.current = window.cloudinary
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dakv6swek',
            uploadPreset: 'Starlight'
        }, function (error, result) {
            if (result.info.files) {
                const new_profile_picture = result.info.files[0].uploadInfo.path
                setProfilePicUrl(new_profile_picture)
                fetch(`/api/users/${users.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile_picture: new_profile_picture })
                })
                    .then(res => res.json())
                    .then(data => {
                        setUsers(data)
                        fetch('/api/posts')
                            .then(res => res.json())
                            .then(data => setPosts(data))
                        fetch('api/comments')
                            .then(res => res.json())
                            .then(data => setComments(data))
                        fetch('/api/users')
                            .then(res => res.json())
                            .then(data => setFriends(data))
                    })
                console.log(result.info.files[0].uploadInfo.path)
            }
        })
    }, [])

    return (
        <div className="upload-btn-wrapper">
            <button className="upload-button" onClick={() => widgetRef.current.open()}>
                <img className="button-img" src="/images/camera.png" />
            </button>
        </div>
    )
}

export default UploadWidget