import React from 'react'
import clsx from 'clsx'
// COMPONENTS
import moment from 'moment'
// TYPES
import { EventT } from '@interfaces/company/event'
// STYLE
import style from '@scss/pages/notifications.module.scss'

type EventItemsPropsT = {
    events: EventT[]
    limit?: number
}

const EventItems: React.FC<EventItemsPropsT> = ({ events, limit }) => {
    if (limit) {
        events = events.slice(0, limit)
    }
    const content = events.map((event) => (
        <div key={ event.id } className={ clsx(style.event_item) }>
            <div className={ clsx(style.event_item_content) }>
                <div className={ clsx(style.event_item__top_panel) }>
                    <p className={ clsx(style.event_title) }>
                        {
                            event.type === 'EVENT' ?
                                <img src="/img/static/event.png" alt=""/>
                                : event.signature?.status === 1 ?
                                    <img src="/img/static/danger.png" alt=""/>
                                    : <img src="/img/static/round-arrows.png" alt=""/>
                        }
                        {
                            event.type === 'EVENT' ? event.title : event.signature?.status === 1 ?
                                'Был подписан документ' : 'Просрочен срок подписания'
                        }
                    </p>
                </div>
                <p className={ clsx(style.event_item__date, style.margin_top) }>
                    { event.type === 'EVENT' ?
                        'Начало '
                        : 'Подписан ' + (event.type === 'SIGNATURE' && event.dateFinish === 0 ? 'разово ' : '')
                    }
                    { moment(event.dateStart).format('lll') }
                </p>
                {
                    event.type === 'SIGNATURE' && event.dateFinish === 0 ? null
                        : <p className={ clsx(style.event_item__date) }>
                            Действителен до { moment(event.dateFinish).format('lll') }
                        </p>
                }
                <p className={ clsx([style.event_item__desc, {
                    [style.bolder]: event.type === 'SIGNATURE' && event?.signature?.status === 1
                }]) }>
                    { event.desc } { event.type === 'SIGNATURE' ? event.signature?.file.title : null }
                    {
                        event.type === 'SIGNATURE' ?
                            <><br/>
                                Подписант: { event.signature?.signer.name }<br/>
                                Должность: { event.signature?.position.title }
                            </> : ''
                    } <br/>
                </p>
            </div>
        </div>

    ))

    return (
        <div className={ clsx(style.event_items, { [style.limit]: limit }) }>
            { content }
        </div>
    )
}

export default EventItems