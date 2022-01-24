import React, { useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// HOOKS
import useStyles from '@ui/material-ui-styles'
import { useModal } from '@modals/index'
// COMPONENTS
import Dropzone from '@ui/dropzone'
// SERVICE
import BannersService from '@services/banners-service';
// STORE
import { $HomeData, setBannersImages } from '@store/home-store'
// TYPES
import { BannersImagesEnum } from '@pages/home'
// STYLES
import style from '@scss/pages/responsibility.module.scss'

const UploadBannerModal = () => {
    // STORES
    const { slides, banners } = useStore($HomeData)
    // STATES
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [validation, setValidation] = useState<string>('')

    const classes = useStyles()
    const { modalData: { type, index }, close } = useModal()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        if (uploadedFiles.length === 0) {
            return setValidation('Загрузите изображение')
        }

        const formData = new FormData()
        formData.append('file', uploadedFiles[0])

        // UPDATING BANNER IMAGE
        if (type === BannersImagesEnum.Banner) {
            BannersService.PostUpdateBannerOrSlide(formData, index, type, (err, res) => {
                if (err || !res?.data) {
                    return setValidation('При сохранении произошла неожиданная ошибка')
                }
                setBannersImages({
                    banners: banners?.map((banner, idx) => {
                        banner = idx === index ? res.data : banner
                        return banner
                    }) || [],
                    slides: slides!,
                })
                close()
            })
        }
        // UPDATING SLIDE IMAGE
        if (type === BannersImagesEnum.Slide) {
            BannersService.PostUpdateBannerOrSlide(formData, index, type, (err, res) => {
                if (err || !res?.data) {
                    return setValidation('При сохранении произошла неожиданная ошибка')
                }
                setBannersImages({
                    banners: banners!,
                    slides: slides?.map((slide, idx) => {
                        slide = idx === index ? res.data : slide
                        return slide
                    }) || [],
                })
                close()
            })
        }
        // ADDING NEW SLIDE WITH IMAGE
        if (type === BannersImagesEnum.AddSlide) {
            BannersService.PostUpdateBannerOrSlide(formData, index, type, (err, res) => {
                if (err || !res?.data) {
                    return setValidation('При сохранении произошла неожиданная ошибка')
                }
                setBannersImages({
                    banners: banners!,
                    slides: [...slides!, res.data],
                })
                close()
            })
        }
    }

    return (
        <div className={ clsx(style.responsibility_document_modal) }>
            <p className="modal_title">
                {
                    type === BannersImagesEnum.Banner ?
                        'Изменить баннеры'
                        : type === BannersImagesEnum.AddSlide ?
                            'Добавить слайд'
                            : 'Изменить слайдер'
                }
            </p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root } ${ clsx(style.responsibility_document_modal_form) }` }
                  onSubmit={ handleSubmit }>
                {
                    type === BannersImagesEnum.Banner ?
                        <Dropzone maxFiles={ 1 } onUpload={ setUploadedFiles } />

                        : type === BannersImagesEnum.AddSlide ?
                            <Dropzone maxFiles={ 1 } onUpload={ setUploadedFiles } />

                            : type === BannersImagesEnum.DeleteSlide ?
                                <Dropzone maxFiles={ 1 } onUpload={ setUploadedFiles } /> 
                                : <Dropzone maxFiles={ 1 } onUpload={ setUploadedFiles } />
                }
                <p className="error-text">{ validation }</p>
                <button type="submit" className="modal_btn">Сохранить</button>
            </form>
        </div>
    )
}

export default UploadBannerModal