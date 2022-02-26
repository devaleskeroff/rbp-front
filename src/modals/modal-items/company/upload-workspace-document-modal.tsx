import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
import qs from 'qs'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
// COMPONENTS
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import Dropzone from '@ui/dropzone'
import { periods } from '@pages/company/workspace'
// STORE
import {
    $WpFiles,
    pushToCommonGroupDocuments,
    setWpFiles
} from '@store/company/workspace-store'
// SERVICE
import WorkspaceService from '@services/workspace-service'
// STYLES
import style from '@scss/modals/company/workspace-document.module.scss'

const UploadWorkspaceDocumentModal = () => {
    const wpFiles = useStore($WpFiles)
    const [period, setPeriod] = useState<string>(periods[0].value.toString())
    const [uploadedFiles, setUploadedFile] = useState<File[]>([])
    const [error, setError] = useState<string>('')

    const history = useHistory()
    const { modalComponent, close } = useModal()
    const classes = useStyles()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        if (uploadedFiles.length > 0) {
            const queryString = qs.parse(history.location.search, { ignoreQueryPrefix: true }) as any
            const formData = new FormData()

            formData.append('periodicity', period)
            formData.append('groupId', queryString.group_id || null)
            formData.append('directoryId', queryString.folder_id || null)

            uploadedFiles.forEach((file, idx) => {
                formData.append('files', uploadedFiles[idx])
            })

            WorkspaceService.UploadFiles(formData, (err, res) => {
                if (err || !res) {
                    if (err?.response?.status === 500 && err.response.data.message.match('large')) {
                        modalBtn.disabled = false
                        return setError('Недопустимый размер файла. Максимальный размер 5мб')
                    }
                    return console.log('При загрузке файлов произошла ошибка')
                }
                setWpFiles([ ...wpFiles, ...res.data ])

                if (!(+queryString.group_id) && !(+queryString.folder_id)) {
                    res.data.forEach(newFile => {
                        pushToCommonGroupDocuments([null, newFile])
                    })
                }
                close()
            })
        }
    }

    const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPeriod(event.target.value as string)
    }

    return (
        <div className={ clsx(style.workspace_document_modal) }>
            <p className="modal_title">Загрузить файлы</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root } ${ clsx(style.workspace_document_modal_form) }` }
                  onSubmit={ handleSubmit }>
                <Dropzone maxFiles={ 15 } onUpload={ files => setUploadedFile(files) } />
                <div className='form-files-list'>
                    {
                        uploadedFiles.length === 0 ? null : uploadedFiles.map((file, idx) => (
                            <div key={idx} className='form-file-item'>
                                <div className='flex-n-c'>
                                    <svg className='file-icon' width="32" height="32" viewBox="0 0 32 32" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 0C6.9 0 6 0.9 6 2V30C6 31.1 6.9 32 8 32H28C29.1 32 30 31.1 30 30V8L22 0H8Z"
                                              fill="#DFE3F1"/>
                                        <path d="M24 8H30L22 0V6C22 7.1 22.9 8 24 8Z" fill="#B0B7BD"/>
                                        <path d="M30 14L24 8H30V14Z" fill="#CAD1D8"/>
                                    </svg>
                                    { file.name } ({ file.size } КБ)
                                </div>
                            </div>
                        ))
                    }
                </div>
                <FormControl variant="filled" className={ clsx(style.period_select) }>
                    <InputLabel id="ot-specialist">Периодичность подписания</InputLabel>
                    <Select
                        labelId="ot-specialist"
                        value={ +period }
                        onChange={ handlePeriodChange }
                    >
                        {
                            periods.map(item => (
                                <MenuItem key={ item.value } value={ item.value }>{ item.label }</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                {
                    error ? <p className="error-text">{ error }</p> : null
                }
                <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default UploadWorkspaceDocumentModal
