import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import passwordGenerator from 'generate-password'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
// COMPONENTS
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
    FilledInput, FormControl, IconButton, InputAdornment,
    InputLabel, MenuItem, Select, TextField
} from '@material-ui/core'
import ReactSelect from 'react-select'
import makeAnimated from 'react-select/animated'
import { selectColourStyles, selectTheme } from '@components/common/common'
// VALIDATOR
import Validator from '@utils/validator'
// SERVICE
import WorkerService from '@services/worker-service'
// STORE
import { pushToWorkersData, updateWorkerData } from '@store/workers-store'
import { $User, UserRoleEnum } from '@store/user-store'
import { $Company, setCompany } from '@store/company/company-store'
// TYPES
import { UserDataT } from '@interfaces/user'
import { SimpleOptionT } from '@interfaces/company/employees'
import { CompanyT } from '@interfaces/company/company'
// INITIALIZATION
const animatedComponents = makeAnimated()

const CreateUserModal = () => {
    const user = useStore($User) as UserDataT
    const selectedCompany = useStore($Company) as CompanyT
    // SELECT STATES
    const [companyOptions, setCompanyOptions] = useState<SimpleOptionT[]>([])
    const [selectedCompanyOptions, setCompanySelectedOptions] = useState<SimpleOptionT[]>([])
    const [selectedCompanies, setSelectedCompanies] = useState<number[]>([])
    // STATES
    const [validation, setValidation] = useState({
        nameError: '',
        emailError: '',
        passwordError: '',
        roleError: '',
    })
    const [value, setValue] = useState({
        role: 3,
        password: '',
        showPassword: false
    })

    // HOOKS
    const { close, modalComponent, modalData } = useModal()
    const classes = useStyles()

    useEffect(() => {
        setCompanyOptions(user.companies.map(company => ({ value: company.id, label: company.name })))
        if (modalData.worker) {
            setValue({ ...value, role: modalData.worker.role })
            setSelectedCompanies(modalData.worker.companies.map((company: { id: number }) => company.id))
        }
    }, [])

    useEffect(() => {
        setCompanySelectedOptions(
            companyOptions.filter(
                company => selectedCompanies?.find(selectedCompanyId => selectedCompanyId === company.value))
        )
    }, [selectedCompanies])


    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue({ ...value, password: event.target.value })
    }

    const handleClickShowPassword = () => {
        setValue({ ...value, showPassword: !value.showPassword })
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValue({ ...value, role: +(event.target.value as number) })
    }

    const generatePassword = () => {
        setValue({
            ...value,
            password: passwordGenerator.generate({ length: 10, numbers: true })
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
            ...Validator(value.role.toString(), 'role')
                .isEqualOneOf([2 /* SPECIALIST */, 3 /* CLIENT */], 'Недопустимое значение')
                .getErrors(),
            // IF ACTIVE EDIT MODE, THEN DONT CHECK PASSWORD, BECAUSE THIS FIELD IS OPTIONAL FOR EDIT MODE
            ...Validator(modalData.worker && value.password.length === 0 ? '111111' : value.password, 'password')
                .isLength({ min: 6 }, 'Пароль должен содержать не менее 6 символов')
                .getErrors(),
        }

        if (Validator.hasError(validating)) {
            modalBtn.disabled = false
            return setValidation(validating as any)
        }
        const newData = {
            name: nameField.value,
            email: emailField.value,
            password: value.password,
            role: value.role,
            companies: selectedCompanies
        }

        // UPDATING WORKER DATA
        if (modalData.worker) {
            return WorkerService.UpdateWorker(modalData.worker.id, newData, (err, res) => {
                if (err || !res) {
                    if (err?.response?.status === 422) {
                        modalBtn.disabled = false
                        return setValidation(err.response.data)
                    }
                    return console.log('При обновлении данных пользователя произошла ошибка')
                }
                const userBelongsToSelectedCompany = res.data.companies.find(company => company.id === selectedCompany.id)
                if (userBelongsToSelectedCompany) {
                    if (res.data.role === UserRoleEnum.Client) {
                        const userAlreadyIsInTheList = selectedCompany.clients.find(client => client.id === res.data.id)
                        if (!userAlreadyIsInTheList) {
                            setCompany({
                                ...selectedCompany,
                                clients: [...selectedCompany.clients, { id: res.data.id, name: res.data.name }],
                                specialists: selectedCompany.specialists.filter(spec => spec.id !== res.data.id)
                            })
                        }
                    }
                    if (res.data.role === UserRoleEnum.Specialist) {
                        const userAlreadyIsInTheList = selectedCompany.specialists.find(spec => spec.id === res.data.id)
                        if (!userAlreadyIsInTheList) {
                            setCompany({
                                ...selectedCompany,
                                specialists: [...selectedCompany.specialists, { id: res.data.id, name: res.data.name }],
                                clients: selectedCompany.clients.filter(client => client.id !== res.data.id)
                            })
                        }
                    }
                } else {
                    const userRemovedFromClients = selectedCompany.clients.find(client => client.id === res.data.id)
                    const userRemovedFromSpecialists = selectedCompany.specialists.find(spec => spec.id === res.data.id)
                    if (userRemovedFromClients) {
                        setCompany({
                            ...selectedCompany,
                            clients: selectedCompany.clients.filter(client => client.id !== res.data.id)
                        })
                    } else if (userRemovedFromSpecialists) {
                        setCompany({
                            ...selectedCompany,
                            specialists: selectedCompany.specialists.filter(spec => spec.id !== res.data.id)
                        })
                    }
                }
                updateWorkerData(res.data)
                close()
            })
        }
        // ADDING NEW WORKER
        WorkerService.AddNewWorker(newData, (err, res) => {
            if (err || !res) {
                if (err?.response?.status === 422) {
                    modalBtn.disabled = false
                    return setValidation(err.response.data)
                }
                return console.log('При добавлении нового пользователя произошла ошибка')
            }
            const userBelongsToSelectedCompany = res.data.companies.find(company => company.id === selectedCompany.id)
            if (userBelongsToSelectedCompany) {
                if (res.data.role === UserRoleEnum.Client) {
                    setCompany({
                        ...selectedCompany,
                        clients: [...selectedCompany.clients, { id: res.data.id, name: res.data.name }]
                    })
                }
                if (res.data.role === UserRoleEnum.Specialist) {
                    setCompany({
                        ...selectedCompany,
                        specialists: [...selectedCompany.specialists, { id: res.data.id, name: res.data.name }]
                    })
                }
            }
            pushToWorkersData(res.data)
            close()
        })
    }

    const onOptionSelect = (options: SimpleOptionT[]) => {
        setSelectedCompanies(options.map(option => option.value))
    }

    return (
        <div key={modalComponent.key} style={{ maxWidth: '650px' }}>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label="Имя" name={"name"} variant="filled" required defaultValue={ modalData.worker?.name || '' } />
                <p className="error-text" style={{ maxWidth: '100%', width: '650px' }}>{ validation.nameError }</p>
                <TextField label="Email" name={"email"} variant="filled" required defaultValue={modalData.worker?.email || ''} />
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
                <p className="error-text">{ validation.passwordError }</p>
                <button type='button' className='white-btn px-20 mt-25' onClick={ generatePassword }>
                    Сгенерировать пароль
                </button>
                <ReactSelect
                    closeMenuOnSelect={ true }
                    components={ animatedComponents }
                    isMulti
                    value={ selectedCompanyOptions }
                    options={ companyOptions }
                    isSearchable
                    placeholder={ 'Компании' }
                    onChange={ values => onOptionSelect(values as any) }
                    styles={ selectColourStyles({ zIndex: 2 }) }
                    theme={ selectTheme }
                />
                <FormControl variant="filled">
                    <InputLabel id="demo-simple-select-filled-label">Роль</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={ value.role }
                        onChange={ handleRoleChange }
                    >
                        <MenuItem value={3}>Клиент</MenuItem>
                        <MenuItem value={2}>Специалист по ОТ</MenuItem>
                    </Select>
                </FormControl>
                <p className="error-text">{ validation.roleError }</p>
                <button type='submit' className='modal_btn'>{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default CreateUserModal
