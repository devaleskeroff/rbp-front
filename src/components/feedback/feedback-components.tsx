import React from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
// STORE
import { setFeedbackItem } from '@store/feedback-store'
// UTILS
import moment from 'moment'
// TYPE
import { FeedbackT } from '@interfaces/feedback'
// STYLE
import style from '@scss/pages/feedback/feedback.module.scss'
import { getTextExcerpt } from '@utils/common-utils'

type FeedbackItemPropsT = {
    onToggleTab: (e: any) => void
    items: FeedbackT[] | null
}

const loaderText = <div style={{ paddingBottom: 24 }}>Идет загрузка...</div>
const emptyText = (type: string) => <div style={{ paddingBottom: 24 }}>Нет { type } вопросов</div>

export const AnsweredRequests = ({ onToggleTab, items }: FeedbackItemPropsT) => {
    const history = useHistory()

    const content = !items ? loaderText : items.length === 0 ? emptyText('отвеченных') : items.map(item => {
        return (
            <div key={item.id} className={clsx(style.reply_section)} onClick={() => {
                setFeedbackItem(item)
                history.push(`/feedback/${item.id}`)
            }}>
                <div className={clsx(style.reply_info_block)}>
                    <p className={clsx(style.reply_title)}>Тема обращения: { getTextExcerpt(item.title, 60) }</p>
                    <p className={clsx(style.reply_info_item)}>ФИО: <span>{ item.userName }</span></p>
                    <p className={clsx(style.reply_info_item)}>Компания: <span>{ item.companyName }</span></p>
                    <p className={clsx(style.reply_info_item)}>Дата обращения: <span>
                        { moment(item.createdAt).format('lll') }</span>
                    </p>
                </div>
                <div className={clsx(style.underline)} />
                <div className={clsx(style.reply_content_block)}>
                    <p className={clsx(style.reply_content_title)}>Ответ:</p>
                    <p className={clsx(style.reply_content_desc)}>{ getTextExcerpt(item.answer!, 160) }</p>
                    <p className={clsx(style.pinned_files_txt)}>
                        <img src='/img/static/pin-icon.png' alt=''/>
                        Прикреплено файлов { item.files.length }
                    </p>
                </div>
            </div>
        )
    })

    return (
        <section className='qa-tab-items full-width'>
            <div className='qa-tab__item shadow-sm'>
                <div className='qa-tab__trigger' onClick={ onToggleTab }>
                    <img src='/img/static/green-arrow_drop_down.png' alt='' className='qa-tab__arrow'/>
                    <p className='qa-tab__title'>Отвеченные</p>
                </div>
                <div className='qa-tab__content feedback'>
                    <div className={clsx(style.reply_sections)}>
                        { content }
                    </div>
                </div>
            </div>
        </section>
    )
}

export const UnAnsweredRequests = ({ onToggleTab, items }: FeedbackItemPropsT) => {
    const history = useHistory()

    const content = !items ? loaderText : items.length === 0 ? emptyText('неотвеченных') : items.map(item => {
        return (
            <div key={item.id} className={clsx([style.reply_section, style.un_answered])} onClick={() => {
                setFeedbackItem(item)
                history.push(`/feedback/${item.id}`)
            }}>
                <div className={clsx(style.reply_info_block)}>
                    <p className={clsx(style.reply_title)}>Тема обращения: { getTextExcerpt(item.title, 60) }</p>
                    <p className={clsx(style.reply_info_item)}>ФИО: <span>{ item.userName}</span></p>
                    <p className={clsx(style.reply_info_item)}>Компания: <span>{ item.companyName }</span></p>
                    <p className={clsx(style.reply_info_item)}>Дата обращения: <span>
                        { moment(item.createdAt).format('lll') }</span>
                    </p>
                </div>
                <div className={clsx(style.underline)} />
                <div className={clsx(style.reply_content_block)}>
                    <p className={clsx(style.pinned_files_txt)}>
                        <img src='/img/static/pin-icon.png' alt=''/>
                        Прикреплено файлов { item.files.length || 0 }
                    </p>
                </div>
            </div>
        )
    })

    return (
        <section className='qa-tab-items full-width'>
            <div className='qa-tab__item shadow-sm'>
                <div className='qa-tab__trigger' onClick={ onToggleTab }>
                    <img src='/img/static/green-arrow_drop_down.png' alt='' className='qa-tab__arrow'/>
                    <p className='qa-tab__title'>Неотвеченные</p>
                </div>
                <div className='qa-tab__content feedback'>
                    <div className={clsx(style.reply_sections)}>
                        { content }
                    </div>
                </div>
            </div>
        </section>
    )
}
