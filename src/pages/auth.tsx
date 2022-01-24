import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
// COMPONENTS
import useStyles from '@ui/material-ui-styles'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import {
    FilledInput,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    TextField
} from '@material-ui/core'
// STORE
import { login, signup } from '@store/auth-store'
// UTILS
import Validator from '@utils/validator'
// LOGO
import OTServiceLogo from '@assets/images/otservice.png'
// STYLES
import style from '@scss/pages/auth/auth.module.scss'

const passwordFieldsInitValues = {
    password: '',
    showPassword: false,
    passwordConfirm: '',
    showConfirmPassword: false
}

const Auth = () => {
    const [activeAction, setActiveAction] = useState<1 | 2>(1)
    const [validation, setValidation] = useState<any>({})
    const [value, setValue] = useState(passwordFieldsInitValues)

    const history = useHistory()
    const classes = useStyles()

    const submitHandler = (e: any) => {
        e.preventDefault()

        if (activeAction === 1) {
            const loginField = document.querySelector('input[name="login"]') as HTMLInputElement
            const passwordField = document.querySelector('input[name="password"]') as HTMLInputElement

            const validating = {
                ...Validator(loginField.value, 'login')
                    .isEmail('Некорректный логин')
                    .isRequired('Поле обязательное')
                    .getErrors(),
                ...Validator(passwordField.value, 'password')
                    .isLength({ min: 6, max: 20 }, 'Пароль должен содержать не менее 6 символов')
                    .isRequired('Поле обязательное')
                    .getErrors()
            }

            if (Validator.hasError(validating)) {
                return setValidation(validating)
            }

            return login({
                email: loginField.value,
                password: passwordField.value,
                cb: (err) => {
                    if (err?.response) {
                        if (typeof err.response.data === 'object') {
                            setValidation(err.response.data)
                        }
                        return
                    }
                    history.push('/')
                }
            })
        }

        const fulLNameField = document.querySelector('input[name="name"]') as HTMLInputElement
        const loginField = document.querySelector('input[name="email"]') as HTMLInputElement
        const passwordField = document.querySelector('input[name="password"]') as HTMLInputElement
        const passConfField = document.querySelector('input[name="passwordConfirm"]') as HTMLInputElement

        const validating = {
            ...Validator(fulLNameField.value, 'fullName')
                .isLength({ min: 3, max: 40 }, 'Поле должно содержать не менее 3 и не более 40 символов')
                .getErrors(),
            ...Validator(loginField.value, 'login')
                .isEmail('Некорректная почта')
                .isRequired('Поле обязательное')
                .getErrors(),
            ...Validator(passwordField.value, 'password')
                .isLength({ min: 6, max: 20 }, 'Пароль должен содержать не менее 6 символов')
                .isRequired('Поле обязательное')
                .getErrors(),
            ...Validator(passConfField.value, 'passwordConfirm')
                .isEqual(passwordField.value, 'Должно совпадать с паролем')
                .getErrors()
        }

        if (Validator.hasError(validating)) {
            return setValidation(validating)
        }

        return signup({
            email: loginField.value,
            name: fulLNameField.value,
            password: passwordField.value,
            passwordConfirm: passConfField.value,
            cb: (err) => {
                if (err?.response) {
                    if (typeof err.response.data === 'object') {
                        setValidation(err.response.data)
                    }
                    return
                }
                setActiveAction(1)
                setValidation({})
                setValue(passwordFieldsInitValues)
            }
        })
    }

    const handleChangeAction = (action: 1 | 2) => {
        setActiveAction(action)
        setValidation({})
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, confirmPassword?: boolean) => {
        if (confirmPassword) {
            return setValue({ ...value, passwordConfirm: event.target.value })
        }
        setValue({ ...value, password: event.target.value })
    }

    const handleClickShowPassword = (confirmPasswordField: boolean) => {
        if (confirmPasswordField) {
            return setValue({ ...value, showConfirmPassword: !value.showConfirmPassword })
        }
        setValue({ ...value, showPassword: !value.showPassword })
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    return (
        <div className={ clsx(style.auth_container) }>
            <div className={ clsx(style.auth_section) }>
                <div className={ clsx(style.auth_section_content) }>
                    <img src={ '/' + OTServiceLogo } alt="" />
                    <p className={ clsx(style.welcome_text) }>Добро пожаловать в ОТ Сервис!</p>
                    <p className={ clsx(style.welcome_desc) }>
                        Выполните вход, зарегистрируйтесь или ознакомтесь с тарификацией
                    </p>
                    <form className={ `${ clsx(style.auth_form) } ${ classes.root }` } onSubmit={ submitHandler }>
                        <div className={ clsx(style.action_buttons) }>
                            <button type='button' className={ clsx(style.action_button, {
                                [style.active]: activeAction === 1
                            }) } onClick={ () => handleChangeAction(1) }>
                                Вход
                            </button>
                            <button type='button' className={ clsx(style.action_button, {
                                [style.active]: activeAction === 2
                            }) } onClick={ () => handleChangeAction(2) }>
                                Регистрация
                            </button>
                        </div>
                        {
                            activeAction === 1 ?
                                // LOGIN
                                <>
                                    <TextField key={1} label="Логин" placeholder={ 'Логин' } name="login" variant="filled"
                                               helperText={ validation.loginError } />
                                    <FormControl key={3} variant="filled">
                                        <InputLabel htmlFor="filled-adornment-password">Пароль</InputLabel>
                                        <FilledInput
                                            type={ value.showPassword ? 'text' : 'password' }
                                            value={ value.password }
                                            onChange={ handlePasswordChange }
                                            name="password"
                                            placeholder={'Пароль'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => handleClickShowPassword(false)}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {value.showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        <FormHelperText>{ validation.passwordError }</FormHelperText>
                                    </FormControl>
                                    <p className="error-text">{ validation.authError }</p>
                                    <button className="modal_btn">Войти</button>
                                </> :
                                // SIGNUP
                                <>
                                    <TextField key={2} label="ФИО" placeholder={ 'ФИО' } variant="filled" name="name"
                                               helperText={ validation.fullNameError }/>
                                    <TextField key={1} label="Почта" placeholder={ 'Почта' } variant="filled" name="email"
                                               helperText={ validation.loginError }/>
                                    <FormControl key={3} variant="filled">
                                        <InputLabel htmlFor="filled-adornment-password">Пароль</InputLabel>
                                        <FilledInput
                                            type={ value.showPassword ? 'text' : 'password' }
                                            value={ value.password }
                                            onChange={ handlePasswordChange }
                                            name="password"
                                            placeholder={'Пароль'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => handleClickShowPassword(false)}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {value.showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        <FormHelperText>{ validation.passwordError }</FormHelperText>
                                    </FormControl>
                                    <FormControl key={4} variant="filled">
                                        <InputLabel htmlFor="filled-password-conf">Подтвердите пароль</InputLabel>
                                        <FilledInput
                                            type={ value.showConfirmPassword ? 'text' : 'password' }
                                            value={ value.passwordConfirm }
                                            onChange={ (e) => handlePasswordChange(e, true) }
                                            name="passwordConfirm"
                                            placeholder={'Подтвердите пароль'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => handleClickShowPassword(true)}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {value.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        <FormHelperText>{ validation.passwordConfirmError }</FormHelperText>
                                    </FormControl>
                                    <p className="error-text">{ validation.signupError }</p>
                                    <button className="modal_btn">Зарегистрироваться</button>
                                </>
                        }
                    </form>
                </div>
            </div>
            <div className={ clsx(style.auth_section) }>

            </div>
        </div>
    )
}

export default Auth