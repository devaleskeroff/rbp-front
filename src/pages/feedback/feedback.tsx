import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import { Title } from '@components/common/common'
import TextField from '@material-ui/core/TextField'
import { AnsweredRequests, UnAnsweredRequests } from '@components/feedback'
import useStyles from '@ui/material-ui-styles'
// STORE
import { $FeedbackItems, $FeedbackStates, createFeedback, fetchFeedbackItems } from '@store/feedback-store'
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'
// TYPE
import { FeedbackT } from '@interfaces/feedback'
// STYLES
import '@scss/pages/question-answer.scss'
import style from '@scss/pages/feedback/feedback.module.scss'

const Feedbacks = () => {
    // STATE
    const [selectedFiles, setSelectedFiles] = useState<any>({})
    const [answeredFeedbacks, setAnsweredFeedbacks] = useState<FeedbackT[] | null>(null)
    const [unansweredFeedbacks, setUnansweredFeedbacks] = useState<FeedbackT[] | null>(null)
    // STORE
    const feedbacks = useStore($FeedbackItems)
    const { isFetched } = useStore($FeedbackStates)
    const userRole = useStore($UserAddPermissions)

    const classes = useStyles()

    useEffect(() => {
        if (!isFetched) {
            fetchFeedbackItems()
        }
    }, [])

    useEffect(() => {
        let answeredFeedbacks = feedbacks.filter(({ answer }) => !!answer)
        let unansweredFeedbacks = feedbacks.filter(({ answer }) => !answer)

        setAnsweredFeedbacks(answeredFeedbacks)
        setUnansweredFeedbacks(unansweredFeedbacks)
    }, [feedbacks])

    const toggleTab = (e: any) => {
        const tab = e.target.closest('.qa-tab__item')
        tab.classList.toggle('active')
    }

    const LoadedFiles = ({ files, setSelectedFiles }: any) => {
        const content: any = []

        for(let key in files) {
            const currentFile = files[key]

            if (!currentFile || !+currentFile.size) {
                break
            }
            content.push(
                <div key={key} className={clsx(style.feedback_form_file_item)}>
                    <div className='flex-n-c'>
                        <svg className={ clsx(style.file_icon) } width="32" height="32" viewBox="0 0 32 32" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 0C6.9 0 6 0.9 6 2V30C6 31.1 6.9 32 8 32H28C29.1 32 30 31.1 30 30V8L22 0H8Z"
                                  fill="#DFE3F1" />
                            <path d="M24 8H30L22 0V6C22 7.1 22.9 8 24 8Z" fill="#B0B7BD"/>
                            <path d="M30 14L24 8H30V14Z" fill="#CAD1D8"/>
                        </svg>
                        { currentFile.name } ({ Math.ceil(currentFile.size * 0.001) } КБ)
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    onClick={() => {
                        let newFileList: any = {}

                        for(let key2 in files) {
                            // IF CURRENT FILE IS NOT EQUAL TO CLICKED FILE, THEN DONT DELETE A FILE FROM FILES LIST
                            if (files[key2].lastModified !== currentFile.lastModified ||
                                files[key2].size !== currentFile.size) {
                                newFileList[key2] = files[key2]
                            }
                        }
                        setSelectedFiles({ ...newFileList })
                    }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            )
        }
        return content
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const title = document.querySelector('input[name="title"]') as HTMLInputElement
        const description = document.querySelector('textarea[name="description"]') as HTMLInputElement

        if (!title || !description) {
            return
        }
        const formData = new FormData()

        formData.append('title', title.value)
        formData.append('description', description.value)

        for (let key in selectedFiles) {
            if (selectedFiles[key] instanceof File) {
                formData.append('files', selectedFiles[key])
            }
        }
        createFeedback({
            formData: formData,
            cb: () => {
                title.value = ''
                description.value = ''
                setSelectedFiles({})
            }
        })
    }

    return (
        <>
            <main className="content-container">
                <div className="content-section">
                    <div className="top-content">
                        <BreadCrumb items={ ['Главная', 'Обратная связь'] }/>
                        <Title text='Обратная связь' />
                    </div>
                    <section className='qa-tab-items full-width'>
                        <div className='qa-tab__item shadow-sm'>
                            <div className='qa-tab__trigger' onClick={ toggleTab }>
                                <img src='/img/static/green-arrow_drop_down.png' alt='' className='qa-tab__arrow'/>
                                <p className='qa-tab__title'>Задать вопрос</p>
                            </div>
                            <div className='qa-tab__content'>
                                <div className={clsx([style.reply_sections, style.fixed])}>
                                    <form className={classes.root} noValidate autoComplete="off" onSubmit={ handleSubmit }>
                                        <TextField label="Тема обращения" name={'title'} variant="filled" onChange={ e => {
                                            if (e.target.value.length > 125) {
                                                e.target.value = e.target.value.substring(0, e.target.value.length - 1)
                                            }
                                        }} />
                                        <TextField
                                            label="Опишите проблему"
                                            name={'description'}
                                            multiline
                                            rows={4}
                                            variant="filled"
                                        />
                                        <div className={clsx(style.feedback_form_files_list)}>
                                            <LoadedFiles files={ selectedFiles } setSelectedFiles={ setSelectedFiles } />
                                        </div>
                                        <div className={clsx(style.feedback_form_actions)}>
                                            <button className={clsx(style.feedback_send_btn)} type='submit'>
                                                Отправить
                                            </button>
                                            <input multiple type='file' name='' id='feedback-file' hidden
                                                   onChange={e => setSelectedFiles(e.target.files)} />
                                            <label htmlFor='feedback-file'><img src='/img/static/pin-icon.png' alt=''/></label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                    <AnsweredRequests onToggleTab={toggleTab} items={answeredFeedbacks} />
                    <UnAnsweredRequests onToggleTab={toggleTab} items={unansweredFeedbacks} />
                </div>
            </main>
        </>
    )
}

export default Feedbacks
