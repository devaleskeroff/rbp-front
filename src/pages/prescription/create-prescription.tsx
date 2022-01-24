import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import { ColorfulButton, Title } from '@components/common/common'
import useStyles from '@ui/material-ui-styles'
import { TextField } from '@material-ui/core'
import Dropzone from '@ui/dropzone'
import { PrescriptionsFilesList } from '@components/prescriptions/prescriptions-components'
// STORE
import {
    $SelectedPrescription,
    pushToPrescriptions,
    resetSelectedPrescription,
    setSelectedPrescription,
    updatePrescription,
} from '@store/prescription-store'
// SERVICE
import PrescriptionService from '@services/prescription-service'
// UTILS
import { useModal } from '@modals/index'
// VALIDATOR
import Validator from '@utils/validator'
// STYLES
import style from '@scss/pages/prescription/create-prescription.module.scss'

const CreatePrescription: React.FC = () => {
    const prescription = useStore($SelectedPrescription)
    const [executor, setExecutor] = useState<{ id: number, name: string } | null>(null)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [validation, setValidation] = useState({
        titleError: '',
        descError: '',
        executorError: ''
    })

    const classes = useStyles()
    const query = useRouteMatch<{ id: string }>()
    const history = useHistory()
    const { open } = useModal()

    const editMode = !!query.params?.id
    const title = !editMode ? 'Создание предписания' : 'Изменение предписания'

    const handleExecutorChange = (id: number, name: string) => {
        setExecutor({ id, name })
    }

    useEffect(() => {
        if (editMode && !prescription) {
            return history.push('/prescriptions')
        }
        if (editMode && prescription) {
            setExecutor({ id: prescription.executor.id, name: prescription.executor.name })
        }

        return () => resetSelectedPrescription()
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const title = document.querySelector('input[name="title"]') as HTMLInputElement
        const desc = document.querySelector('textarea[name="desc"]') as HTMLTextAreaElement

        const validating: any = {
            ...Validator(title.value, 'title').isRequired('Это поле обязательно').getErrors(),
            ...Validator(desc.value, 'desc').isRequired('Это поле обязательно').getErrors(),
            ...Validator(executor?.id.toString() || '', 'executor').isNumber('Не выбран исполнитель').getErrors()
        }

        if (Validator.hasError(validating)) {
            return setValidation(validating)
        }

        const formData = new FormData()
        formData.append('title', title.value)
        formData.append('desc', desc.value)
        formData.append('executor', executor!.id.toString())
        uploadedFiles.forEach(file => formData.append('files', file))

        // UPDATING PRESCRIPTION
        if (editMode) {
            if (!prescription) return
            return PrescriptionService.UpdatePrescription(prescription.id, formData, (err, res) => {
                if (err || !res) {
                    if (err?.response?.status === 422) {
                        return setValidation(validating)
                    }
                    return console.log('При обновлении предписания произошла ошибка')
                }
                updatePrescription(res.data)
                setSelectedPrescription(res.data)
                history.push('/prescriptions')
            })
        }
        // CREATING NEW PRESCRIPTION
        PrescriptionService.CreatePrescription(formData, (err, res) => {
            if (err || !res) {
                if (err?.response?.status === 422) {
                    return setValidation(validating)
                }
                return console.log('При создании предписания произошла ошибка')
            }
            pushToPrescriptions([res.data])
            history.push('/prescriptions')
        })
    }

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Предписания', title] }/>
                    <Title text={ title } withHistory />
                </div>
                <div className={ clsx(style.creation_content_container) }>
                    <div className={ clsx(style.title_panel) }>
                        { !editMode ? 'Создать предписание' : 'Изменить предписание' }
                    </div>
                    <div className="underline"/>
                    <form className={ `${ classes.root }` } onSubmit={ handleSubmit }>
                        <TextField label="Введите название"
                                   placeholder={ 'Название' }
                                   variant="filled"
                                   name={ 'title' }
                                   defaultValue={ prescription?.title }
                                   required
                        />
                        <p className="error-text">{ validation.titleError }</p>
                        <p className={ clsx(style.executor_text)}>
                            { executor?.name ? `Исполнитель: ${executor?.name}` : 'Выберите исполнителя' }
                        </p>
                        <ColorfulButton text={'Выбрать исполнителя'} type={'button'} plusIcon={ false } onClick={ () => {
                            open('ChoosingExecutorModal', {
                                modalData: { onSelect: handleExecutorChange }
                            })
                        } } />
                        <p className="error-text">{ validation.executorError }</p>
                        <TextField label="Введите текст"
                                   placeholder={ 'Текст' }
                                   variant="filled"
                                   required
                                   name={ 'desc' }
                                   defaultValue={ prescription?.desc }
                                   multiline
                                   rows={ 4 }
                        />
                        <p className="error-text">{ validation.descError }</p>
                        {/* FILE DROPZONE */ }
                        <div className={ clsx(style.dropzone) }>
                            <Dropzone onUpload={ files => setUploadedFiles(files) } maxFiles={5} />
                            {
                                editMode && prescription ?
                                    <p>Загруженные ранее: { JSON.parse(prescription.files).length }</p>
                                    : null
                            }
                        </div>
                        {/* UPLOADED FILES (ONLY FOR EDIT MODE) */}
                        <PrescriptionsFilesList files={uploadedFiles} />
                        <button className={ clsx(style.submit_btn) } type={ 'submit' }>
                            { !editMode ? 'Создать' : 'Сохранить' }
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default CreatePrescription