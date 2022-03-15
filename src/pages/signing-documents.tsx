import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import qs from 'qs'
import clsx from 'clsx'
// COMPONENTS
import { TextField } from '@material-ui/core'
import useStyles from '@ui/material-ui-styles'
import { Documents } from '@components/signing-documents'
import { Loader } from '@ui/indicators'
// SERVICE
import EmployeeService from '@services/employee-service'
// UTILS
import { concatApiUrl } from '@utils/api-tools'
// TYPES
import { EmployeeDataForSigningT } from '@interfaces/company/employees'
// IMAGES
import logo from '@assets/images/header-logo.png'
// STYLES
import headerStyle from '@scss/components/header.module.scss'
import style from '@scss/pages/signing-documents.module.scss'

const SigningDocuments = () => {
    const [disableToSendCode, setDisableToSendCode] = useState<boolean>(true)
    const [disableToSign, setDisableToSign] = useState<boolean>(true)
    const [documentsSigned, setDocumentsSigned] = useState<boolean>(false)
    const [employee, setEmployee] = useState<EmployeeDataForSigningT | null>(null)
    const [validation, setValidation] = useState({
        signingError: '',
        codeError: '',
        codeSuccess: ''
    })
    const verifyingIdRef = useRef('')
    const companyIdRef = useRef(0)

    const classes = useStyles()
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        const Querystring = qs.parse(location.search, { ignoreQueryPrefix: true })
        const companyId = Querystring.company as string
        const employeeId = Querystring.employee as string
        const verifyingId = Querystring.hash as string

        if (!companyId || !employeeId || !verifyingId) {
            return history.push('/')
        }
        verifyingIdRef.current = verifyingId
        companyIdRef.current = +companyId

        EmployeeService.GetDocumentsForSigning(companyId, employeeId, verifyingId, (err, res) => {
            if (err || !res) {
                return history.push('/')
            }
            setEmployee(res.data)
        })
    }, [])

    const onReadyToSign = () => {
        setDisableToSendCode(false)
    }

    const onVerificationCodeSend = () => {
        if (!disableToSendCode) {
            EmployeeService.SendSigningVerificationCode(companyIdRef.current, employee?.id as number, verifyingIdRef.current, (err, res) => {
                if (err) {
                    if (err.response?.status === 409) {
                        return setValidation({ ...validation, codeSuccess: '', codeError: err.response?.data.message })
                    }
                    return console.log('Произошла неожиданная ошибка')
                }
                setValidation({
                    ...validation,
                    codeError: '',
                    codeSuccess: 'Код подтверждения отправлена на почту'
                })
            })
        }
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        const codeField = document.querySelector('input[name="code"]') as HTMLInputElement
        if (!codeField) {
            return
        }
        EmployeeService.SignDocuments({
            companyId: companyIdRef.current,
            verifyingId: verifyingIdRef.current,
            employeeId: employee?.id as number,
            code: codeField.value
        }, (err, res) => {
            if (err) {
                if (err.response?.status === 409) {
                    return setValidation({
                        ...validation,
                        signingError: 'При подписании документов произошла нелжиданная ошибка'
                    })
                }
            }
            setDocumentsSigned(true)
        })
    }

    return (
        <>
            <header className={ clsx(headerStyle.header) }>
                <div className={ clsx(headerStyle.header_cont) }>
                    {/* HEADER CONTENT */ }
                    <div className={ clsx(headerStyle.right_side) }>
                        {/* LOGOS */ }
                        <div className={ clsx(headerStyle.flex) }>
                            <Link to={ '/' }>
                                <img src={ logo } alt="OT" className={ clsx(headerStyle.header_logo) } />
                            </Link>
                            <img src={ concatApiUrl(employee?.company?.image || '/static/images/dummy-logo.png') } alt=""
                                 className={ clsx(headerStyle.company_logo) } />
                        </div>
                    </div>
                </div>
            </header>
            {
                !employee ? <Loader /> : documentsSigned ?
                    // DOCUMENTS SIGNED CONTENT
                    <div className={ clsx(style.documents_signed_container) }>
                        <p className={ clsx(style.documents_signed_title) }>
                            Спасибо, документы подписаны!
                        </p>
                        <span className={ clsx(style.documents_signed_desc) }>Можете закрыть страницу</span>
                    </div>
                    // DOCUMENTS SIGNING CONTENT
                    : <div className={ clsx(style.signing_container) }>
                        <div className={ clsx(style.signing_content) }>
                            {/* WELCOME TEXTS */ }
                            <p className={ clsx(style.welcome_title) }>
                                Здравствуйте, { employee.name }!
                            </p>
                            <p className={ clsx(style.subtitle) }>
                                Для подписания знакомьтесь с докуметамы по Охране труда
                            </p>
                            {/* DOCUMENTS */ }
                            <Documents items={employee.signingDocuments} onReadyToSign={ onReadyToSign } />
                            {/* SENDING CODE FOR SIGNING DOCUMENTS */ }
                            <div className={ clsx(style.sending_code_container) }>
                                <p className="error-text">{ validation.codeError }</p>
                                <p className="success-text" style={{ fontSize: 14 }}>{ validation.codeSuccess }</p>
                                <button className={ clsx(style.sending_code_btn) } disabled={ disableToSendCode }
                                onClick={ onVerificationCodeSend }>
                                    Отправить код
                                </button>
                                <p className={ clsx(style.sending_code_desc) }>
                                    Код придет в сообщении по почте { employee.email }
                                </p>
                                <form className={`${classes.root} ${classes.signing}`} onSubmit={submitHandler}>
                                    <TextField
                                        label={ 'Введите код из сообщения' }
                                        name={ 'code' }
                                        variant={ 'filled' }
                                        placeholder={ 'Код' }
                                        onChange={e => setDisableToSign(!(!disableToSendCode && e.target.value.length > 6)) }
                                    />
                                    <p className="error-text">{ validation.signingError }</p>
                                    <button type={'submit'} className={ clsx(style.signing_docs_btn) } disabled={ disableToSign }>
                                        { disableToSign ? 'Ознакомьтесь со всеми документами' : 'Подписать документы' }
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default SigningDocuments
