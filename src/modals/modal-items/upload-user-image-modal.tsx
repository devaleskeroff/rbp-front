import React, { useState } from 'react'
import clsx from 'clsx'
import { useStore } from 'effector-react'
// HOOKS
import useModal from '@modals/modal-hook'
// COMPONENTS
import Cropper from '@ui/cropper'
// SERVICES
import AuthService from '@services/auth-service'
// STORE
import { $User, setUserData } from '@store/user-store'
import { $modalData, setModalData } from '@store/modal-store'
// TYPES
import { UserDataT } from '@interfaces/user'
// STYLES
import style from '@scss/modals/profile/upload_user_image.module.scss'

const UploadUserImageModal = () => {
    // STORE
    const user = useStore($User) as UserDataT
    const modalData = useStore($modalData)
    // STATES
    const [cropper, setCropper] = useState<Cropper | null>(null)
    const [cropperDeg, setCropperDeg] = useState<number>(0)
    const { close } = useModal()

    const cropImage = () => {
        cropper?.getCroppedCanvas().toBlob((blob) => {
            setModalData(blob)
            submit(blob)
        })
    }

    const rotateTo = (deg: number) => {
        if (cropper) {
            setCropperDeg((_) => {
                cropper.rotateTo(deg)
                return deg
            })
        }
    }

    const submit = async (blob: Blob | null) => {
        if (!blob) {
            return
        }
        const formData = new FormData()
        formData.append('avatar', blob)

        AuthService.SetAvatar(formData, (err, res) => {
            if (err || !res) {
                return console.log('При изменении автара произошла ошибка')
            }
            user.avatar = res.data
            setUserData({ ...user })
            close()
        })
    }

    return (
        <div className={ clsx(style.upload_image_modal) }>
            <p className="modal_title">Изменить фото профиля</p>
            <div className="underline" />
            <div className={ clsx(style.upload_image_modal_content) }>
                <p className={ clsx(style.upload_image_subtitle) }>
                    Чтобы кадрировать изображение, выделите нужную область и нажмите кнопку “Установить как фото
                    профиля”
                </p>
                <Cropper
                    img={ modalData.preview }
                    className={ clsx(style.cropper) }
                    setCropper={ setCropper }
                />
                <div className={ clsx(style.cropper_rotate_buttons) }>
                    <div className={ clsx(style.cropper_rotate_item) } onClick={ () => rotateTo(cropperDeg - 90) }>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 15L9 20L4 15" stroke="#626262" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M20 4H13C11.9391 4 10.9217 4.42143 10.1716 5.17157C9.42143 5.92172 9 6.93913 9 8V20"
                                stroke="#626262" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Влево
                    </div>
                    <div className={ clsx(style.cropper_rotate_item) } onClick={ () => rotateTo(cropperDeg + 90) }>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 15L9 20L4 15" stroke="#626262" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                                d="M20 4H13C11.9391 4 10.9217 4.42143 10.1716 5.17157C9.42143 5.92172 9 6.93913 9 8V20"
                                stroke="#626262" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Вправо
                    </div>
                </div>
                <button onClick={ cropImage } className={ clsx(style.cropper_handler_btn) }>
                    Установить как фото профиля
                </button>
            </div>
        </div>
    )
}

export default UploadUserImageModal