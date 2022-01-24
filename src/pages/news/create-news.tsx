import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import { Title } from '@components/common/common'
import { TextField } from '@material-ui/core'
import useStyles from '@ui/material-ui-styles'
import Dropzone from '@ui/dropzone'
// SERVICE
import NewsService from '@services/news-service'
// VALIDATOR
import Validator from '@utils/validator'
// STORE
import {
    $NewsActionType,
    $SelectedNewsData,
    prependToSpecHelps,
    setSelectedNewsData,
    updateSpecHelp,
} from '@store/news/news-store'
import {
    prependToNews,
    prependToPractices,
    updateNews,
    updatePractice
} from '@store/news/news-store'
// STYLES
import style from '@scss/pages/news-and-practice/news-and-practice.module.scss'
import { NewsT } from '@interfaces/news'

const CreateNews = () => {
    // STORES
    const newsType = useStore($NewsActionType)
    const currentItem = useStore($SelectedNewsData)
    // STATES
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [validation, setValidation] = useState({
        titleError: '',
        textError: '',
        uploadError: '',
        processError: ''
    })

    const { pathname } = useLocation()
    const query = useRouteMatch<{ id: string }>()
    const history = useHistory()
    const classes = useStyles()

    let breadcrumbText: string;

    switch (newsType) {
        case 'createNews': case 'editNews':
            breadcrumbText = 'Новости'
            break;
        case 'createPractice': case 'editPractice':
            breadcrumbText = 'Судебная практика'
            break;
        case 'createSpecHelp': case 'editSpecHelp':
            breadcrumbText = 'Новости'
            break;
        default: breadcrumbText = 'Новости';
    }

    useEffect(() => {
        if (newsType.includes('edit') && !currentItem) {
            let redirectUrl: string

            switch (newsType) {
                case 'editNews':
                    redirectUrl = '/news/'
                    break;
                case 'editPractice':
                    redirectUrl = '/practice/'
                    break;
                case 'editSpecHelp':
                    redirectUrl = '/help/'
                    break;
                default: redirectUrl = '/news/'
            }

            return history.push(redirectUrl + query.params.id)
        }
    }, [])

    const submitHandler = (e: any) => {
        e.preventDefault()
        const title = document.querySelector('input[name="title"]') as HTMLInputElement
        const text = document.querySelector('textarea[name="text"]') as HTMLInputElement
        let tags = document.querySelector('input[name="tags"]') as HTMLInputElement

        if (!title || !text) {
            return
        }

        const validating: any = {
            ...Validator(title.value, 'title').isRequired('Это поле обязательно').getErrors(),
            ...Validator(text.value, 'text').isRequired('Это поле обязательно').getErrors(),
        }

        if (newsType.includes('create') && uploadedFiles.length === 0) {
            validating.uploadError = 'Загрузите как минимум 1 изображение'
        }

        if (Validator.hasError(validating)) {
            return setValidation(validating)
        }

        const formData = new FormData()
        formData.append('title', title.value)
        formData.append('text', text.value)
        formData.append('tags', tags.value)

        if (newsType.includes('create')) {
            uploadedFiles.forEach(file => formData.append('images', file))
        }

        switch (newsType) {
            case 'createNews':
                NewsService.CreateNews(formData, 'NEWS', (err, res) => {
                    if (err || !res) {
                        if (err?.response?.status === 422) {
                            return setValidation(err.response.data)
                        }
                        return console.log(err)
                    }
                    prependToNews(res.data)
                    history.goBack()
                })
                break
            case 'createPractice':
                NewsService.CreateNews(formData, 'PRACTICE', (err, res) => {
                    if (err || !res) {
                        if (err?.response?.status === 422) {
                            return setValidation(err.response.data)
                        }
                        return console.log(err)
                    }
                    prependToPractices(res.data)
                    history.goBack()
                })
                break
            case 'createSpecHelp':
                NewsService.CreateNews(formData, 'SPEC_HELP', (err, res) => {
                    if (err || !res) {
                        if (err?.response?.status === 422) {
                            return setValidation(err.response.data)
                        }
                        return console.log(err)
                    }
                    prependToSpecHelps(res.data)
                    history.goBack()
                })
                break
            case 'editNews':
                NewsService.UpdateNews(currentItem?.id as number, formData, 'NEWS', (err, res) => {
                    if (err || !res) {
                        if (err?.response?.status === 422) {
                            return setValidation(err.response.data)
                        }
                        return console.log(err)
                    }
                    const updatedItem = {
                        ...currentItem,
                        title: title.value,
                        text: text.value,
                        tags: tags.value
                    } as NewsT

                    updateNews(updatedItem)
                    setSelectedNewsData(updatedItem)
                    history.push('/news/' + currentItem?.id)
                })
                break
            case 'editPractice':
                NewsService.UpdateNews(currentItem?.id as number, formData, 'PRACTICE', (err, res) => {
                    if (err || !res) {
                        if (err?.response?.status === 422) {
                            return setValidation(err.response.data)
                        }
                        return console.log(err)
                    }
                    const updatedItem = {
                        ...currentItem,
                        title: title.value,
                        text: text.value,
                        tags: tags.value
                    } as NewsT

                    updatePractice(updatedItem)
                    setSelectedNewsData(updatedItem)
                    history.push('/practice/' + currentItem?.id)
                })
                break
            case 'editSpecHelp':
                NewsService.UpdateNews(currentItem?.id as number, formData, 'SPEC_HELP', (err, res) => {
                    if (err || !res) {
                        if (err?.response?.status === 422) {
                            return setValidation(err.response.data)
                        }
                        return console.log(err)
                    }
                    const updatedItem = {
                        ...currentItem,
                        title: title.value,
                        text: text.value,
                        tags: tags.value
                    } as NewsT

                    updateSpecHelp(updatedItem)
                    setSelectedNewsData(updatedItem)
                    history.push('/help/' + currentItem?.id)
                })
                break
            default: return
        }
    }

    return (
        <main className='content-container'>
            <div className='content-section'>
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', breadcrumbText] }/>
                    <div className="content-title-section-with-btn">
                        <Title text={ pathname.includes('create') ? 'Создание новости' : 'Изменение новости' } withHistory />
                    </div>
                </div>
                <div className={ clsx(style.create_news_container) }>
                    <form className={classes.root} onSubmit={submitHandler}>
                        {/* TITLE */}
                        <TextField label="Название новости" variant="filled" name='title' required
                                   placeholder='Название новости' defaultValue={currentItem?.title || ''} />
                        <p className="error-text">{ validation.titleError }</p>
                        {/* TAGS */}
                        <TextField label="Теги" variant="filled" name='tags'
                                   placeholder='Через запятую добавьте теги' defaultValue={currentItem?.tags || ''} />
                        {/* DROPZONE */}
                        {
                            newsType.includes('edit') ? null :
                                <>
                                    <p className={ clsx(style.create_news_field_title) }>Загрузить фото *</p>
                                    <p className={ clsx(style.create_news_field_desc) }>Допускается только формат изображения!</p>
                                    <Dropzone accept='image/*' maxFiles={4} onUpload={ files => setUploadedFiles(files) } />
                                    <p className="error-text">{ validation.uploadError }</p>
                                </>
                        }
                        {/* TEXT */}
                        <TextField label="Текст новости" multiline variant="filled" name='text' required
                                   placeholder="Текст новости" defaultValue={currentItem?.text || ''} />
                        <p className="error-text">{ validation.textError }</p>
                        <p className="error-text">{ validation.processError }</p>
                        {/* SUBMIT BUTTON */}
                        <button type="submit" className={ clsx(style.create_news_btn) }>
                            { newsType.includes('edit') ? 'Сохранить' : 'Создать' }
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default CreateNews