import React from 'react'
import Cropper from 'react-cropper'
// STYLES
import 'cropperjs/dist/cropper.css'

type ImageCropperPropsT = {
    img: any
    setCropper: (instance: Cropper) => void
    className?: string
}

const ImageCropper: React.FC<ImageCropperPropsT> = ({ img, setCropper, className }) => {
    return (
        <Cropper
            src={ img }
            className={ className }
            initialAspectRatio={ 16 / 9 }
            guides={ false }
            onInitialized={ (instance) => setCropper(instance) }
            center
            viewMode={ 1 }
            aspectRatio={ 1 }
            dragMode="move"
            rotatable
        />
    )
}

export default ImageCropper