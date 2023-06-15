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
        <div>
            <button onClick={()=> widgetRef.current.open()}>Upload</button>
        </div>
    )
}

export default UploadWidget