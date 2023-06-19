import { useEffect, useRef } from "react";

function UploadWidget(){

    const [image, setImage] = useState([])

    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    useEffect(()=>{
        cloudinaryRef.current = window.cloudinary
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dakv6swek',
            uploadPreset: 'Starlight'
        }, function(error, result){
            if(result.info.files){
                console.log(result.info.files[0].uploadInfo.path)
            }
        })
    }, [])

    function saveToDb(){
        fetch('/api/users', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({profile_picture: profile_picture})
        })
        .then(res=>res.json())
        .then(data=>console.log(data))
    }

    return(
        <div className="upload-btn-wrapper">
            <button className="upload-button" onClick={()=> widgetRef.current.open()}>
                <img className="button-img" src="/src/images/camera.png"/>
            </button>
        </div>
    )
}

export default UploadWidget