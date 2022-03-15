import React  from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { useDropzone } from 'react-dropzone'
import { BreadCrumb } from '@components/common'
import { Title } from '@components/common/common'
import { Companies, getOfflinePreview, UserData, UserPassword } from '@components/profile/profile-components'
// STORE
import { $User } from '@store/user-store'
// UTILS
import { concatApiUrl } from '@utils/api-tools'
// TYPES
import { UserDataT } from '@interfaces/user'
// ICONS
import EditIcon from '@assets/images/edit.png'
// STYLES
import style from '@scss/pages/profile.module.scss'

const Profile = () => {
    const user = useStore($User) as UserDataT

    const { open } = useModal()

    const onFileSelect = async (acceptedFile: any) => {
        const blob = new Blob(acceptedFile, { type: acceptedFile.type })
        const preview = await getOfflinePreview(blob);

        open('UploadUserImage', { modalData: { blob, preview, file: acceptedFile } })
    }

    const { getInputProps, getRootProps } = useDropzone({
        onDrop: onFileSelect,
        multiple: false,
        accept: ['image/*']
    })

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Личный кабинет'] } />
                    <Title text='Личный кабинет' />
                </div>
                {/* PROFILE SECTIONS */}
                <div className={ clsx(style.profile_content) }>
                    {/* FIRST SECTION */}
                    <div className={ clsx(style.profile_content_item) }>
                        <p className={ clsx(style.profile_item_title) }>Изменения личной информации</p>
                        <div { ...getRootProps() } className={ clsx(style.profile_img_container) }>
                            <input { ...getInputProps() } />
                            <img src={ EditIcon } alt="" className={ clsx(style.edit_icon) } />
                            {/*<img src={ user.avatar ? ConcatApiUrl(user.avatar) : '/img/static/dummy-avatar.png' }*/}
                            <img src={ concatApiUrl(user.avatar) } alt="" className={ clsx(style.profile_img) }
                            />
                        </div>
                        {/* USER INFO */}
                        <UserData />
                    </div>
                    {/* SECOND SECTION */}
                    <div className={ clsx(style.profile_content_item) }>
                        <p className={ clsx(style.profile_item_title) }>Настройки пароля</p>
                        {/* USER PASSWORD */}
                        <UserPassword />
                    </div>
                    {/* THIRD SECTION */}
                    <div className={ clsx(style.profile_content_item) }>
                        <p className={ clsx(style.profile_item_title) }>Ваши компании</p>
                        {/* COMPANIES */}
                        <Companies />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Profile
