import React from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { useModal } from '@modals/index'
import { ErrorIndicator, Loader } from '@ui/indicators'
import { Tooltip } from '@material-ui/core'
import moment from 'moment'
// SERVICE
import EmployeeService from '@services/employee-service'
// STORE
import { $UserRole, UserRoleEnum } from '@store/user-store'
// TYPES
import { CalendarEventItemsPropsT } from '@interfaces/company/event'
// STYLE
import style from '@scss/pages/company/company-calendar.module.scss'
// INITIALIZATION
moment.locale('ru')

// CHANGING CALENDAR ARROWS OPACITY
export const setCalendarArrowsOpacity = (value: string) => {
    const calendarNavigationArrows = document.querySelectorAll('.react-calendar__navigation__arrow') as NodeListOf<HTMLButtonElement>
    calendarNavigationArrows?.forEach(arrow => arrow.style.opacity = value)
}

// GETTING MONTH TEXT
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const monthsWithEnding = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']

export const getMonth = (month: number, withEnding: boolean = false) => {
    return withEnding ? monthsWithEnding[month] : months[month]
}

// EVENT ITEMS
export const CalendarEventItems: React.FC<CalendarEventItemsPropsT> = (props) => {
    const { events, error, isPending, onUpdate, onDelete } = props

    const userRole = useStore($UserRole)
    const { open } = useModal()

    const handleReSignature = (e: any, signatureId: number, signerId: number) => {
        EmployeeService.ReSendForSignature(signerId, signatureId, (err, res) => {
            if (err) {
                return console.log('При отправке документа на переподписание произошла ошибка')
            }
            e.target.style.display = 'none'
        })
    }

    const content = events.map(event => {
        return (
            <div key={ event.id } className={ clsx(style.event_item) }>
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
                    {
                        userRole === UserRoleEnum.Client ? null :
                            <div className={ clsx(style.event_item__buttons) }>
                                {
                                    event.signature?.status !== 3 ?
                                        <Tooltip title="Отправить на почту" placement="top">
                                            <button className={ clsx(style.event_item__button) }
                                                    onClick={ () => open('EventEmailModal', {
                                                        modalData: { event }
                                                    }) }>
                                                <img src="/img/static/mail.png" alt="" />
                                            </button>
                                        </Tooltip> : null

                                }
                                {
                                    event.type === 'EVENT' ?
                                        <Tooltip title="Изменить" placement="top">
                                            <button className={ clsx(style.event_item__button) }
                                                    onClick={ () => open('CreateEventModal', {
                                                        modalData: { event, modalTitle: 'Изменить ивент' },
                                                        btnText: 'Сохранить',
                                                        onConfirm: onUpdate
                                                    }) }>
                                                <img src="/img/static/edit.png" alt=""/>
                                            </button>
                                        </Tooltip> : null
                                }
                                <Tooltip title="Удалить" placement="top">
                                    <button className={ clsx(style.event_item__button) }
                                            onClick={ () => open('ConfirmActionModal', {
                                                modalData: { text: `Вы уверены, что хотите удалить событие "${ event.title || 'Подписание документа' }"` },
                                                btnText: 'Удалить',
                                                onConfirm: () => onDelete(event.id)
                                            }) }>
                                        <img src="/img/static/delete.png" alt=""/>
                                    </button>
                                </Tooltip>
                            </div>
                    }
                </div>
                <p className={ clsx(style.event_item__date) }>
                    { event.dateFinish === 0 ?
                        'Разово ' + moment(event.dateStart).format('lll')
                        : moment(event.dateStart).format('lll')
                        + ' - ' + moment(event.dateFinish).format('lll')
                    }
                </p>
                <p className={ clsx(style.event_item__desc) }>
                    { event.desc } { event.type === 'SIGNATURE' ? event.signature?.file.title : '' }
                    {
                        event.type === 'SIGNATURE' ?
                            <><br/>
                                Подписант: { event.signature?.signer.name }<br/>
                                Должность: { event.signature?.position.title }
                                {
                                    userRole !== UserRoleEnum.Client && event.signature?.status && event.signature.status !== 1 ?
                                        <><br/>
                                            <button className={ clsx(style.event_item__resignature_btn) }
                                                    onClick={e => handleReSignature(e,
                                                        event.signature?.id as number,
                                                        event.signature?.signer.id as number
                                                    ) }>
                                                Переподписать
                                            </button>
                                        </> : null
                                }
                            </> : ''
                    } <br/>
                </p>
            </div>
        )
    })

    return error ? <ErrorIndicator/> : isPending ? <Loader/> : <>{ content }</>
}