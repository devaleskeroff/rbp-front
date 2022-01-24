import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import Dropzone from '@ui/dropzone'
import { BreadCrumb } from '@components/common'
import { Title } from '@components/common/common'
import useStyles from '@ui/material-ui-styles'
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import 'moment/locale/ru'
// SERVICE
import CourseService from '@services/course-service'
// VALIDATOR
import Validator from '@utils/validator'
// STORE
import { $SelectedCourse, pushToCourses, updateCourse } from '@store/study-store'
// STYLES
import style from '@scss/pages/prescription/create-prescription.module.scss'

export type CreatePrescriptionPropsT = {
    editMode?: boolean
}

const CreateCourse: React.FC = () => {
    const currentCourse = useStore($SelectedCourse)
    const [courseType, setCourseType] = useState<string>('COURSE')
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [validation, setValidation] = useState({
        titleError: '',
        descError: '',
        typeError: '',
        linkError: '',
        uploadError: '',
    })
    const getDateStart = () => {
        if (currentCourse?.dateStart) {
            return new Date(currentCourse.dateStart)
        }
        return new Date()
    }
    const [startDate, setStartDateChange] = useState(getDateStart)

    const classes = useStyles()
    const history = useHistory()
    const query = useRouteMatch<{ id: string }>()

    const editMode = !!query.params.id
    const title = !editMode ? 'Добавление курса' : 'Изменение курса'

    useEffect(() => {
        if (editMode) {
            if (!currentCourse) {
                return history.push('/study-center')
            }
            setCourseType(currentCourse.type)
        }

    }, [])

    const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCourseType(event.target.value as string)
    }

    const onStartDateChange = (date: any, value?: string | null) => {
        setStartDateChange(date._d)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const title = document.querySelector('input[name="title"]') as HTMLInputElement
        const desc = document.querySelector('textarea[name="desc"]') as HTMLTextAreaElement
        const link = document.querySelector('input[name="link"]') as HTMLInputElement
        const tags = document.querySelector('input[name="tags"]') as HTMLInputElement
        const teachers = document.querySelector('input[name="teachers"]') as HTMLInputElement

        const validating: any = {
            ...Validator(title.value, 'title').isRequired('Поле обязательно').getErrors(),
            ...Validator(desc.value, 'desc').isRequired('Поле обязательно').getErrors(),
            ...Validator(link.value, 'link').isUrl('Некорректная ссылка').getErrors(),
            ...Validator(courseType, 'type')
                .isEqualOneOf(['COURSE', 'WEBINAR'], 'Некорректно значение')
                .isRequired('Поле обязательно')
                .getErrors(),
        }

        if (uploadedFiles.length === 0 && !editMode) {
            validating.uploadError = 'Загрузите изображение'
        }

        if (Validator.hasError(validating)) {
            return setValidation(validating)
        }

        const formData = new FormData()
        formData.append('title', title.value)
        formData.append('desc', desc.value)
        formData.append('tags', tags.value)
        formData.append('teachers', teachers.value)
        formData.append('link', link.value)
        formData.append('type', courseType)
        formData.append('dateStart', startDate.getTime().toString())
        formData.append('image', uploadedFiles[0])

        if (editMode && currentCourse) {
            return CourseService.UpdateCourse(currentCourse.id, formData, (err, res) => {
                if (err || !res) {
                    if (err?.response?.status === 422) {
                        return setValidation(err.response.data)
                    }
                    return console.log('При изменении курса произошла ошибка')
                }
                updateCourse(res.data)
                history.push('/study-center')
            })
        }
        CourseService.AddCourse(formData, (err, res) => {
            if (err || !res) {
                if (err?.response?.status === 422) {
                    return setValidation(err.response.data)
                }
                return console.log('При добавлении курса произошла ошибка')
            }
            pushToCourses([res.data])
            history.push('/study-center')
        })
    }

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Учебный центр', title] } />
                    <Title text={ title } withHistory />
                </div>
                <div className={ clsx(style.creation_content_container) }>
                    <div className={ clsx(style.title_panel) }>
                        { !editMode? 'Добавить курс': 'Изменить курс' }
                    </div>
                    <div className="underline" />
                    <form className={ `${ classes.root }` } onSubmit={ handleSubmit }>
                        <TextField label="Название курса"
                                   placeholder={ 'Название' }
                                   name={ 'title' }
                                   variant="filled"
                                   required
                                   defaultValue={ currentCourse?.title }
                        />
                        <p className="error-text">{ validation.titleError }</p>
                        <TextField label="Теги"
                                   placeholder={ 'Введите теги через запятые' }
                                   name={ 'tags' }
                                   variant="filled"
                                   defaultValue={ currentCourse?.tags }
                        />
                        <TextField label="Преподаватели"
                                   placeholder={ 'Введите имена преподавателей через запятые' }
                                   name={ 'teachers' }
                                   variant="filled"
                                   defaultValue={ currentCourse?.teachers }
                        />
                        <FormControl variant="filled">
                            <InputLabel id="demo-simple-select-filled-label">Выберите тип</InputLabel>
                            <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                value={ courseType }
                                name={ 'type' }
                                onChange={ handleRoleChange }
                            >
                                <MenuItem value={'COURSE'}>Курс</MenuItem>
                                <MenuItem value={'WEBINAR'}>Вебинар</MenuItem>
                            </Select>
                        </FormControl>
                        <p className="error-text">{ validation.typeError }</p>
                        <TextField label="Ссылка на курс"
                                   placeholder={ 'Вставьте ссылку' }
                                   name={ 'link' }
                                   variant="filled"
                                   required
                                   defaultValue={ currentCourse?.link }
                        />
                        <p className="error-text">{ validation.linkError }</p>
                        <MuiPickersUtilsProvider libInstance={ moment } utils={ MomentUtils } locale={ 'ru' }>
                            <Grid container className={ clsx(style.main_pickers_container) }>
                                <Grid item xs={ 12 } md={ 6 }>
                                    <Grid container className={ clsx(style.pickers_container) }>
                                        <Grid item xs={ 12 } sm={ 6 }>
                                            <DateTimePicker
                                                value={startDate}
                                                disablePast
                                                ampm={false}
                                                onChange={ onStartDateChange }
                                                label="Начало ивента"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <TextField label="Описание курса"
                                   placeholder={ 'Описание' }
                                   variant="filled"
                                   name={ 'desc' }
                                   required
                                   multiline
                                   rows={ 4 }
                                   defaultValue={ currentCourse?.desc }
                        />
                        <p className="error-text">{ validation.descError }</p>
                        {/* FILE DROPZONE */}
                        <div className={ clsx(style.dropzone) }>
                            <Dropzone maxFiles={ 1 } requiredFiles={ 1 } onUpload={ setUploadedFiles } />
                        </div>
                        <p className="error-text">{ validation.uploadError }</p>
                        <button className={ clsx(style.submit_btn) }>{ !editMode ? 'Добавить' : 'Сохранить' }</button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default CreateCourse