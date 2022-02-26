import React, { useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// HOOKS
import useModal from '@modals/modal-hook'
// STORE
import { $User, setUserData } from '@store/user-store'
import { $Company, setCompany } from '@store/company/company-store'
// SERVICES
import CompanyService from '@services/company-service'
// COMPONENTS
import useStyles from '@ui/material-ui-styles'
import Dropzone from '@ui/dropzone/dropzone'
import { TextField } from '@material-ui/core'
// UTILS
import Validator from '@utils/validator'
// TYPES
import { UserDataT } from '@interfaces/user'
import { CompanyT } from '@interfaces/company/company'
// STYLES
import style from '@scss/modals/company/create-company.module.scss'

const CreateCompanyModal = () => {
    // STORE
    const user = useStore($User)
    const selectedCompany = useStore($Company) as CompanyT
    // STATE
    const [validation, setValidation] = useState<any>({})
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    // HOOKS
    const { close, modalComponent, modalData } = useModal()
    const classes = useStyles()

    const handleSubmit = (e: any, id: number | null) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        const name = document.querySelector('input[name="name"]') as HTMLInputElement
        const legalEntity = document.querySelector('input[name="legalEntity"]') as HTMLInputElement
        const inn = document.querySelector('input[name="inn"]') as HTMLInputElement
        const physicalAddress = document.querySelector('input[name="physicalAddress"]') as HTMLInputElement
        const legalAddress = document.querySelector('input[name="legalAddress"]') as HTMLInputElement
        const shortDesc = document.querySelector('input[name="shortDesc"]') as HTMLInputElement

        const validating = {
            ...Validator(name.value, 'name').isLength({ min: 3 })
                .withMessage('Это поле должно содержать не менее 5 символов').getErrors(),
            ...Validator(inn.value, 'inn').isRequired()
                .withMessage('Это поле обязательно').getErrors(),
            ...Validator(physicalAddress.value, 'physicalAddress').isRequired()
                .withMessage('Это поле обязательно').getErrors(),
            ...Validator(legalAddress.value, 'legalAddress').isRequired()
                .withMessage('Это поле обязательно').getErrors(),
            ...Validator(legalEntity.value, 'legalEntity').isRequired()
                .withMessage('Это поле обязательно').getErrors()
        }

        if (Validator.hasError(validating)) {
            modalBtn.disabled = false
            return setValidation(validating)
        }

        const formData = new FormData()
        formData.append('name', name?.value)
        formData.append('inn', inn?.value)
        formData.append('companyLogo', uploadedFiles[0])
        formData.append('legalAddress', legalAddress?.value)
        formData.append('physicalAddress', physicalAddress?.value)
        formData.append('legalEntity', legalEntity?.value)
        formData.append('shortDesc', shortDesc?.value)

        if (id) {
            return CompanyService.UpdateCompany(id, formData,
                (err, res) => {
                    if (err || !res) {
                        if (err?.response?.status === 422) {
                            modalBtn.disabled = false
                            setValidation(err.response.data)
                        }
                        return console.log('При обновлении данных компании произошла ошибка')
                    }

                    // UPDATED USER DATA
                    const updatedUserData = { ...user } as UserDataT

                    updatedUserData.companies = updatedUserData.companies.map(company => {
                        // UPDATING COMPANY INFO IN COMPANY LIST
                        if (company.id === id) {
                            company.name = name.value
                            company.legalEntity = legalEntity.value
                            company.inn = inn.value
                            company.image = res.data.imagePath || company.image

                            // UPDATING SELECTED COMPANY INFO IF UPDATED COMPANY IS SELECTED COMPANY
                            if (company.id === selectedCompany.id) {
                                setCompany({
                                    ...selectedCompany,
                                    name: name.value,
                                    legalEntity: legalEntity.value,
                                    inn: inn.value,
                                    shortDesc: shortDesc.value,
                                    physicalAddress: physicalAddress.value,
                                    legalAddress: legalAddress.value,
                                    image: res.data.imagePath || company.image
                                })
                            }
                        }
                        return company
                    })

                    setUserData(updatedUserData)
                    close()
                }
            )
        }

        if (uploadedFiles.length === 0) {
            modalBtn.disabled = false
            return setValidation({
                imageError: 'Загрузите изображение'
            })
        }

        CompanyService.CreateCompany(formData, (err, res) => {
            if (err || !res) {
                if (err?.response?.status === 422) {
                    modalBtn.disabled = false
                    setValidation(err.response.data)
                }
                return console.log('При создании новой компании произошла ошибка')
            }
            const updatedUser = { ...user } as UserDataT
            updatedUser.companies.push(res.data)
            updatedUser.selectedCompany = res.data.id

            setUserData(updatedUser)
            setCompany(res.data)
            close()
        })
    }

    return (
        <div key={ modalComponent.key } className={ clsx(style.create_company_modal) }>
            <p className="modal_title">Создать компанию</p>
            <div className="underline"/>
            <form className={ `modal_content ${ classes.root }` }
                  onSubmit={ e => handleSubmit(e, modalData.id || null) }>
                <TextField name="name" label="Название" variant="filled" defaultValue={ modalData.name || '' }/>
                <p className="error-text">{ validation.nameError }</p>
                <TextField name="legalEntity" label="Юридическое лицо" variant="filled"
                           defaultValue={ modalData.legalEntity || '' }/>
                <p className="error-text">{ validation.legalEntityError }</p>
                <TextField name="inn" label="ИНН" variant="filled" defaultValue={ modalData.inn || '' }/>
                <p className="error-text">{ validation.innError }</p>
                <TextField name="physicalAddress" label="Адрес физический" variant="filled"
                           defaultValue={ modalData.physicalAddress || '' }/>
                <p className="error-text">{ validation.physicalAddressError }</p>
                <TextField name="legalAddress" label="Адрес юридический" variant="filled"
                           defaultValue={ modalData.legalAddress || '' }/>
                <p className="error-text">{ validation.legalAddressError }</p>
                <TextField name="shortDesc" label="Краткое описание" variant="filled"
                           defaultValue={ modalData.shortDesc || '' }/>
                <p className="error-text">{ validation.shortDescError }</p>
                <Dropzone maxFiles={ 1 } requiredFiles={ 1 } onUpload={ files => setUploadedFiles(files)}/>
                <p className="error-text">{ validation.imageError }</p>
                <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default CreateCompanyModal
