import React, { useMemo, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { TextField, Tooltip } from '@material-ui/core'
import useStyles from '@ui/material-ui-styles'
import useModal from '@modals/modal-hook'
import Loader from '@ui/indicators/loader'
import Validator from '@utils/validator'
// SERVICES
import CompanyService from '@services/company-service'
import AuthService from '@services/auth-service'
// STORE
import { $User, $UserAddPermissions, setUserData, UserRoleEnum } from '@store/user-store'
import { $Company, setCompany } from '@store/company/company-store'
// UTILS
import { concatApiUrl } from '@utils/api-tools'
// ICONS
import EditIcon from '@assets/images/edit.png'
import DeleteIcon from '@assets/images/delete.png'
// TYPES
import { UserDataT } from '@interfaces/user'
import { CompanyT } from '@interfaces/company/company'
// STYLES
import style from '@scss/pages/profile.module.scss'
import moment from 'moment'

export const UserData = () => {
    const user = useStore($User) as UserDataT
    const [editMode, setEditMode] = useState<boolean>(false)
    const [validation, setValidation] = useState({
        nameError: '',
        emailError: '',
        phoneError: '',
        updateError: ''
    })

    const classes = useStyles()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const name = document.querySelector('input[name="name"]') as HTMLInputElement
        const email = document.querySelector('input[name="email"]') as HTMLInputElement
        const phone = document.querySelector('input[name="phone"]') as HTMLInputElement

        if (!name || !phone || (user.role === UserRoleEnum.Admin && !email)) {
            return
        }

        // IF THERE ARE NO CHANGES THEN RETURN
        if (name.value === user.name && phone.value === user.phone) {
            if (user.role !== UserRoleEnum.Admin || (user.role === UserRoleEnum.Admin && email.value === user.email)) {
                return setEditMode(false)
            }
        }

        const validation: any = {
            ...Validator(name.value, 'name')
                .isLength({ min: 3, max: 40 }, '???????? ???????????? ?????????????????? ???? ?????????? 3 ?? ???? ?????????? 40 ????????????????')
                .getErrors(),
            ...Validator(phone.value, 'phone')
                .isNumber('???????? ???? ?????????? ?????????????????? ??????????????')
                .getErrors(),
        }

        if (user.role === UserRoleEnum.Admin || user.role === UserRoleEnum.SuperAdmin) {
            validation.emailError = (Validator(email.value, 'email').isEmail('???????????????????????? ?????????? ????. ??????????').getErrors() as any).emailError
        }

        if (Validator.hasError(validation)) {
            return setValidation(validation as any)
        }

        AuthService.UpdateUserData({
            email: email?.value || null,
            name: name.value,
            phone: phone.value
        }, (err, res) => {
            if (err || !res) {
                if (err?.response?.status === 422 || err?.response?.status === 409) {
                    return setValidation(err.response.data)
                }
                return setValidation({ updateError: '?????? ???????????????????? ???????????? ?????????????????? ?????????????????????? ????????????' } as any)
            }
            setValidation({} as any)
            setUserData({
                ...user,
                email: email?.value?.toLowerCase() || user.email,
                name: name.value,
                phone: phone.value
            })
            setEditMode(false)
        })
    }

    return (
        editMode ?
            <form className={ classes.root } onSubmit={ handleSubmit }>
                <TextField label="??????" variant="filled" name="name" defaultValue={ user.name } />
                <p className="error-text">{ validation.nameError }</p>
                {
                    user.role === UserRoleEnum.Admin || user.role === UserRoleEnum.SuperAdmin ?
                        <>
                            <TextField label="??????????" variant="filled" name="email" defaultValue={ user.email } />
                            <p className="error-text">{ validation.emailError }</p>
                        </> : null
                }
                <TextField label="??????????????" variant="filled" name="phone" defaultValue={ user.phone } />
                <p className="error-text">{ validation.updateError || validation.phoneError }</p>
                <button type="submit" className={ clsx(style.submit_btn) }>?????????????????? ??????????????????</button>
                <button type="reset" className={ clsx(style.cancel_btn) } onClick={() => {
                    setValidation({} as any)
                    setEditMode(false)
                }}>????????????
                </button>
            </form>
            : <div className={ clsx(style.user_info) }>
                <p className={ clsx(style.user_info_item) }>??????: <span>{ user.name }</span></p>
                <p className={ clsx(style.user_info_item) }>??????????: <span>{ user.email }</span></p>
                <p className={ clsx(style.user_info_item) }>??????????????: <span>{ user.phone }</span></p>
                <p className={ clsx(style.user_info_item) }>??????????????: <span>{
                    user.premium ? user.premium === 777
                            ? '??????????????????????'
                            : '???? ' + moment(user.premium).format('ll')
                        : '??????????????????????'
                }</span></p>
                <button className={ clsx(style.edit_data_btn) } onClick={() => setEditMode(true)}>???????????????? ????????????</button>
            </div>
    )
}

export const UserPassword = () => {
    const permissions = useStore($UserAddPermissions)
    // STATES
    const [editMode, setEditMode] = useState<boolean>(false)
    const [validation, setValidation] = useState({
        oldPasswordError: '',
        passwordError: '',
        passwordConfirmError: ''
    })
    const classes = useStyles()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const oldPassword = document.querySelector('input[name="oldPassword"]') as HTMLInputElement
        const password = document.querySelector('input[name="password"]') as HTMLInputElement
        const passwordConfirm = document.querySelector('input[name="passwordConfirm"]') as HTMLInputElement

        if (!oldPassword || !password || !passwordConfirm) return

        const validation = {
            ...Validator(oldPassword.value, 'oldPassword')
                .isLength({ min: 6, max: 20 }, '???????????? ???????????? ?????????????????? ???? ?????????? 6 ?? ???? ?????????? 20 ????????????????')
                .getErrors(),
            ...Validator(password.value, 'password')
                .isLength({ min: 6, max: 20 }, '???????????? ???????????? ?????????????????? ???? ?????????? 6 ?? ???? ?????????? 20 ????????????????')
                .getErrors(),
            ...Validator(passwordConfirm.value, 'passwordConfirm')
                .isEqual(password.value, '???????????? ???? ??????????????????')
                .getErrors()
        }

        if (Validator.hasError(validation)) {
            return setValidation(validation as any)
        }

        AuthService.ChangePassword({
            oldPassword: oldPassword.value,
            password: password.value,
            passwordConfirm: passwordConfirm.value
        }, (err) => {
            if (err) {
                if (err?.response?.status === 422) {
                    return setValidation(err.response.data)
                }
                return console.log('?????? ?????????????????? ???????????? ?????????????????? ????????????')
            }
            setValidation({} as any)
            setEditMode(false)
        })
    }

    return (
        editMode ?
            <form className={ classes.root } onSubmit={ handleSubmit }>
                <TextField label="???????????? ????????????" variant="filled" type='password' name='oldPassword' />
                <p className="error-text">{ validation.oldPasswordError }</p>
                <TextField label="?????????? ????????????" variant="filled" type='password' name='password' />
                <p className="error-text">{ validation.passwordError }</p>
                <TextField label="?????????????????? ????????????" variant="filled" type='password' name='passwordConfirm' />
                <p className="error-text">{ validation.passwordConfirmError }</p>
                <button type="submit" className={ clsx(style.submit_btn) }>?????????????????? ??????????????????</button>
                <button type="reset" className={ clsx(style.cancel_btn) } onClick={() => {
                    setValidation({} as any)
                    setEditMode(false)
                }}>????????????
                </button>
            </form>
            : <div className={ clsx(style.password_section_content) }>
                <div className={ clsx(style.password_mask) }>????????????: <p>**********</p></div>
                {
                    permissions.roleIsIn([UserRoleEnum.SuperAdmin]) ?
                        <button className={ clsx(style.edit_password_btn) } onClick={() => setEditMode(true)}>
                            ?????????????? ????????????
                        </button>
                        : null
                }
            </div>
    )
}

export const Companies = () => {
    // STORE
    const user = useStore($User) as UserDataT
    const selectedCompany = useStore($Company) as CompanyT
    // HOOKS
    const { open } = useModal()

    const onEditCompany = (id: number) => {
        CompanyService.GetCompany(id, (err, res) => {
            if (err || !res?.data) {
                return console.log('Unexpected error occurred while fetched company data')
            }
            open('CreateCompanyModal', {
                modalData: res.data,
                btnText: '????????????????'
            })
        })
    }

    const onDeleteHandler = (id: number) => {
        CompanyService.DestroyCompany(id, (err, res) => {
            if (err || !res) {
                return console.log('?????????????????? ???????????? ?????? ???????????????? ????????????????')
            }
            const updatedUserData = { ...user }
            updatedUserData.companies = updatedUserData.companies.filter(company => company.id !== id)

            setUserData(updatedUserData)

            if (selectedCompany.id === id && updatedUserData.companies.length > 0) {
                return CompanyService.GetCompany(updatedUserData.companies[0].id, (err, res) => {
                    if (err || !res) {
                        return console.log('?????????????????? ???????????? ?????? ???????????????? ????????????????')
                    }

                    setCompany(res.data)
                })
            } else if (selectedCompany.id === id) {
                return CompanyService.SelectAndGetCompany((err, res) => {
                    if (err || !res) {
                        return console.log('?????????????????? ???????????? ?????? ?????????????????? ??????????????????')
                    }
                    updatedUserData.companies.push(res.data)

                    setUserData({ ...updatedUserData })
                    setCompany(res.data)
                })
            }
        })
    }

    const content = useMemo(() => user.companies.map(company => (
        <div key={company.id} className={ clsx(style.company_item, { [style.active]: company.id === selectedCompany.id }) }>
            <div className={ clsx(style.img_section) }>
                <img src={ concatApiUrl(company.image) } alt="" />
            </div>
            <div className={ clsx(style.info_section) }>
                <p className={ clsx(style.company_name) }>{ company.name }</p>
                <div className={ clsx(style.company_info_item) }>????.????????: <p>{ company.legalEntity }</p></div>
                <div className={ clsx(style.company_info_item) }>??????: <p>{ company.inn }</p></div>
            </div>
            <div className={ clsx(style.action_buttons) }>
                {
                    user.role === UserRoleEnum.Client ? null :
                            <Tooltip title="????????????????" placement={'top'}>
                                <img src={ EditIcon } alt="" className={ clsx(style.edit_company_icon) }
                                     onClick={() => onEditCompany(company.id)} />
                            </Tooltip>

                }
                {
                    user.role === UserRoleEnum.Admin || user.role === UserRoleEnum.SuperAdmin ?
                        <Tooltip title="??????????????" placement={'top'}>
                            <img src={ DeleteIcon } alt="" className={ clsx(style.delete_company_icon) }
                                 onClick={() => open('ConfirmActionModal', {
                                     modalData: { text: `???? ??????????????, ?????? ???????????? ?????????????? ???????????????? "${company.name}"?` },
                                     btnText: '??????????????',
                                     onConfirm: () => onDeleteHandler(company.id)
                                 })} />
                        </Tooltip> : null
                }
            </div>
        </div>
    )), [user, selectedCompany])

    if (!user) {
        return <Loader />
    }

    return (
        <div className={ clsx(style.companies) }>
            { content }
        </div>
    )
}

export const getOfflinePreview = (file: any) => (
    new Promise((resolve) => {
        const fileReader = new FileReader()

        fileReader.onload = (e: any) => {
            resolve(e.target.result)
        }

        fileReader.onloadend = (e: any) => {
            resolve(fileReader.result)
        }

        fileReader.readAsDataURL(file)
    })
)
