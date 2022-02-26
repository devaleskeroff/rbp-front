import React, { useState } from 'react'
import passwordGenerator from 'generate-password'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
// COMPONENTS
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
    FilledInput, FormControl, IconButton, InputAdornment,
    InputLabel, TextField
} from '@material-ui/core'
// VALIDATOR
import Validator from '@utils/validator'
// SERVICE
import AuthService from "@services/auth-service";

const CreateSuperAdminModal = () => {
    // STATES
    const [validation, setValidation] = useState({
        nameError: '',
        emailError: '',
        passwordError: ''
    })
    const [value, setValue] = useState({
        password: '',
        passwordConfirm: '',
        showPassword: false
    })

    // HOOKS
    const { close, modalComponent, modalData } = useModal()
    const classes = useStyles()

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue({ ...value, password: event.target.value })
    }

    const handlePasswordConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue({ ...value, passwordConfirm: event.target.value })
    }

    const handleClickShowPassword = () => {
        setValue({ ...value, showPassword: !value.showPassword })
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const generatePassword = () => {
        const generatedPassword = passwordGenerator.generate({ length: 10, numbers: true })

        setValue({
            ...value,
            showPassword: true,
            password: generatedPassword,
            passwordConfirm: generatedPassword
        })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        const nameField = document.querySelector('input[name="name"]') as HTMLInputElement
        const emailField = document.querySelector('input[name="email"]') as HTMLInputElement

        const validating = {
            ...Validator(nameField?.value || '', 'name')
                .isLength({ min: 3 }, 'Это поле обязательно')
                .getErrors(),
            ...Validator(emailField?.value || '', 'email')
                .isEmail('Некорректный адрес эл. почты')
                .getErrors(),
            // IF ACTIVE EDIT MODE, THEN DONT CHECK PASSWORD, BECAUSE THIS FIELD IS OPTIONAL FOR EDIT MODE
            ...Validator(value.password, 'password')
                .isLength({ min: 6 }, 'Пароль должен содержать не менее 6 символов')
                .getErrors(),
        }

        if (Validator.hasError(validating)) {
            modalBtn.disabled = false
            return setValidation(validating as any)
        }

        const newSuperAdminData = {
            name: nameField.value,
            email: emailField.value,
            password: value.password,
            passwordConfirm: value.passwordConfirm
        }

        return AuthService.AddNewSuperAdmin(newSuperAdminData, (err, res) => {
            if (err || !res) {
                if (err?.response?.status === 422) {
                    modalBtn.disabled = false
                    return setValidation(err.response.data)
                }
                return console.log('При создании суперадмина произошла ошибка')
            }
            close()
        })
    }

    return (
        <div key={modalComponent.key} style={{ maxWidth: '650px' }}>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label="ФИО" name={"name"} variant="filled" required />
                <p className="error-text" style={{ maxWidth: '100%', width: '650px' }}>{ validation.nameError }</p>
                <TextField label="Email" name={"email"} variant="filled" required />
                <p className="error-text">{ validation.emailError }</p>
                <FormControl variant="filled">
                    <InputLabel htmlFor="filled-adornment-password">Пароль</InputLabel>
                    <FilledInput
                        type={ value.showPassword ? 'text' : 'password' }
                        value={ value.password }
                        onChange={ handlePasswordChange }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    { value.showPassword ? <Visibility /> : <VisibilityOff /> }
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <FormControl variant="filled">
                    <InputLabel htmlFor="filled-adornment-password">Подтвердите пароль</InputLabel>
                    <FilledInput
                        type={ value.showPassword ? 'text' : 'password' }
                        value={ value.passwordConfirm }
                        onChange={ handlePasswordConfirmChange }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    { value.showPassword ? <Visibility /> : <VisibilityOff /> }
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <p className="error-text">{ validation.passwordError }</p>
                <button type='button' className='white-btn px-20 mt-25' onClick={ generatePassword }>
                    Сгенерировать пароль
                </button>
                <br/>
                <button type='submit' className='modal_btn'>{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default CreateSuperAdminModal
