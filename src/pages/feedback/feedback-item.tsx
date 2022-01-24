import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import { Title } from '@components/common/common'
import Loader from '@ui/indicators/loader'
// STORE
import { $FeedbackItem, fetchFeedbackItem } from '@store/feedback-store'
import { $UserRole, UserRoleEnum } from '@store/user-store'
// HOOKS
import { useModal } from '@modals/index'
// UTILS
import moment from 'moment'
// TYPE
import { FeedbackT } from '@interfaces/feedback'
// STYLES
import '@scss/pages/question-answer.scss'
import style from '@scss/pages/feedback/feedback-item.module.scss'

const FeedbackItemBlocks = ({ feedback }: { feedback: FeedbackT }) => {
    const { open } = useModal()
    const userRole = useStore($UserRole)

    const questionContent = (
        <div className={ clsx(style.feedback_item_section) }>
            <div className={ clsx(style.feedback_item__title) }>
                <p>Тема обращения: { feedback.title }</p>
                {
                    userRole === UserRoleEnum.SuperAdmin && feedback.answer === null ?
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" onClick={() => open('RespondToFeedbackModal', {
                                 modalData: { feedbackId: feedback.id }
                        })}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg> : null
                }
            </div>
            <div className={ clsx(style.underline) }/>
            <div className={ clsx(style.feedback_item__content) }>
                <p className={ clsx(style.reply_info_item) }>ФИО: <span>{ feedback.userName }</span></p>
                <p className={ clsx(style.reply_info_item) }>Компания: <span>{ feedback.companyName }</span></p>
                <p className={ clsx(style.reply_info_item) }>Дата обращения: <span>
                    { moment(feedback.createdAt).format('lll') }</span>
                </p>
                <p className={ clsx(style.reply_content_desc) }>{ feedback.description }</p>
                <div className={ clsx(style.feedback_form_files_list) }>
                    {
                        feedback.files.map((file, idx) => {
                            const filename = file.path.substring(file.path.lastIndexOf('/') + 1)

                            return (
                                <div key={ idx } className={ clsx(style.feedback_form_file_item) }>
                                    <div className='flex-n-c'>
                                        <img src='/img/static/pdf.png' alt=''/>
                                        { file.name } ({ Math.ceil(file.size * 0.001) } КБ)
                                    </div>
                                    <div className='flex-n-c'>
                                        <a href={ process.env.API_URL + file.path } target={'_blank'} rel="noreferrer">
                                            <svg xmlns='http://www.w3.org/2000/svg' className='' fill='none' viewBox='0 0 24 24'
                                                 stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={ 2 }
                                                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={ 2 }
                                                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/>
                                            </svg>
                                        </a>
                                        <a href={ `${process.env.API_URL}/api/v1/feedback/file?filename=${ filename }` }
                                           target={'_blank'} rel="noreferrer" download>
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'
                                                 stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={ 2 }
                                                      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )

    const answerContent = feedback.answer ? (
        <div className={clsx(style.feedback_item_section)}>
            <div className={clsx(style.feedback_item__title)}>Ответ</div>
            <div className={clsx(style.underline)} />
            <div className={clsx(style.feedback_item__content)}>
                <p className={clsx(style.reply_info_item)}>Дата ответа: <span>
                    { moment(feedback.answeredAt).format('lll') }</span>
                </p>
                <p className={clsx(style.reply_content_desc)}>{ feedback.answer }</p>
            </div>
        </div>
    ) : null

    return (
        <div className={clsx(style.feedback_item__sections)}>
            { questionContent }
            { answerContent }
        </div>
    )
}

const FeedbackItem = () => {
    const feedback = useStore($FeedbackItem)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        if (!feedback && id) {
            fetchFeedbackItem({ id: +id })
        }
    }, [id])

    return (
        <>
            <main className="content-container">
                <div className="content-section">
                    <div className="top-content">
                        <BreadCrumb items={ ['Главная', 'Обратная связь', 'Ответ на вопрос'] }/>
                        <Title text='Ответ на вопрос' withHistory />
                    </div>
                    {
                        feedback === null ? <Loader /> :
                            feedback === false ? 'При загрузке данных произошла ошибка' :
                                <FeedbackItemBlocks feedback={feedback} />
                    }
                </div>
            </main>
        </>
    )
}

export default FeedbackItem