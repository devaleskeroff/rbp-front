import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from 'effector-react'
import qs from 'qs'
import clsx from 'clsx'
// HOOKS
import useStyles from '@ui/material-ui-styles'
import { useModal } from '@modals/index'
// COMPONENTS
import Dropzone from '@ui/dropzone'
import { TextField } from '@material-ui/core'
// SERVICE
import ResponsibilityService from '@services/responsibility-service'
// STORE
import {
    $CommonResponsibilityDocuments, $ResponsibilityDocuments,
    pushToResponsibilityDocs,
    setResponsibilityCommonDocs, setResponsibilityDocuments
} from '@store/responsibility-store'
// STYLES
import style from '@scss/pages/responsibility.module.scss'

const UploadResponsibilityModal = () => {
    // STORES
    const commonDocuments = useStore($CommonResponsibilityDocuments)
    const currentDocuments = useStore($ResponsibilityDocuments)
    // STATES
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [validation, setValidation] = useState<string>('')

    const location = useLocation()
    const classes = useStyles()
    const { modalData, close } = useModal()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        const Querystring = qs.parse(location.search, { ignoreQueryPrefix: true })

        // EDITING FILE
        if (modalData.editMode) {
            const title = document.querySelector('input[name="title"]') as HTMLInputElement

            if (!title?.value) {
                modalBtn.disabled = false
                return setValidation('Это поле обязательно')
            }

            return ResponsibilityService.UpdateFile(modalData.file.id, title.value, (err, _res) => {
                if (err) {
                    modalBtn.disabled = false
                    return setValidation('При изменении файла произошла ошибка')
                }
                if (+(Querystring.folder_id as string) === 0) {
                    setResponsibilityCommonDocs([commonDocuments[0].map(file => {
                        if (file.id === modalData.file.id) {
                            file.title = title.value
                        }
                        return file
                    }), commonDocuments[1]])
                    return close()
                }
                setResponsibilityDocuments([currentDocuments[0].map(file => {
                    if (file.id === modalData.file.id) {
                        file.title = title.value
                    }
                    return file
                }), currentDocuments[1]])
                return close()
            })
        }
        // UPLOADING NEW FILE
        if (uploadedFiles.length === 0) {
            modalBtn.disabled = false
            return setValidation('Загрузите файлы')
        }
        const formData = new FormData()
        uploadedFiles.forEach(file => formData.append('files', file))

        ResponsibilityService.UploadFiles(formData, +(Querystring.folder_id as string) || 0, (err, res) => {
            if (err || !res) {
                if (err?.response?.status === 422) {
                    modalBtn.disabled = false
                    return setValidation(err.response.data.uploadError)
                }
                return console.log('При загрузке файлов произошла ошибка')
            }
            if (+(Querystring.folder_id as string) === 0) {
                res.data.forEach((file: any) => {
                    pushToResponsibilityDocs([file, null])
                })
                return close()
            }
            res.data.forEach((file: any) => {
                pushToResponsibilityDocs([file, null])
            })
            return close()
        })
    }

    return (
        <div className={ clsx(style.responsibility_document_modal) }>
            <p className="modal_title">Загрузить файлы</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root } ${ clsx(style.responsibility_document_modal_form) }` }
                  onSubmit={ handleSubmit }>
                {
                    modalData.editMode ?
                        <TextField label="Название" name={"title"} variant="filled" required
                                   defaultValue={ modalData.file?.title || '' } />
                        :
                        <Dropzone maxFiles={ 3 } onUpload={ setUploadedFiles } />
                }
                <p className="error-text">{ validation }</p>
                <button type="submit" className="modal_btn">{ modalData.editMode ? 'Сохранить' : 'Загрузить' }</button>
            </form>
        </div>
    )
}

export default UploadResponsibilityModal
