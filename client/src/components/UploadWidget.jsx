import { useEffect, useRef } from "react";

function UploadWidget(){
    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    useEffect(()=>{
        cloudinaryRef.current = window.cloudinary
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dakv6swek',
            uploadPreset: 'Starlight'
        }, function(error, result){
            console.log(result)

        })
    }, [])
    return(
        <div className="upload-btn-wrapper">
            <button className="upload-button" onClick={()=> widgetRef.current.open()}>
                <img className="button-img" src="/src/images/camera.png"/>
            </button>
        </div>
    )
}

export default UploadWidget