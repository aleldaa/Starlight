import { useEffect, useRef } from "react"
import UploadWidget from "./UploadWidget"
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"

function Profile({ users }) {

    const cld = new Cloudinary({
        cloud: {
          cloudName: 'dakv6swek'
        }
      }); 
    
      // Use the image with public ID, 'front_face'.
      const myImage = cld.image('v1686795150/lszig7lptnj0ct4y1lsh.jpg');

      myImage.resize(fill().width(300).height(200));

    return (
        <div>
            <div>
                <div>
                    <AdvancedImage cldImg={myImage}/>
                </div>
                <div>
                    <UploadWidget />
                </div>
            </div>
        </div>
    )
}

export default Profile