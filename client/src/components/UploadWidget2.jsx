import { useEffect, useState, useRef } from "react";

function UploadWidget2({users, setBannerUrl}){

    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    useEffect(()=>{
        cloudinaryRef.current = window.cloudinary
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dakv6swek',
            uploadPreset: 'Starlight'
        }, function(error, result){
            if(result.info.files){
                const newBannerPicture = result.info.files[0].uploadInfo.path
                setBannerUrl(newBannerPicture)
                fetch(`/api/users/${users.id}`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({banner_picture: newBannerPicture})
                })
                    .then(res=>res.json())
                    .then(data=>console.log(data))
                console.log(result.info.files[0].uploadInfo.path)
            }
        })
    }, [])

    return(
        <div className="upload-btn-wrapper2">
            <button className="upload-button2" onClick={()=> widgetRef.current.open()}>
                <img className="button-img2" src="/images/camera.png"/>
            </button>
        </div>
    )
}

export default UploadWidget2