import React, { useCallback, useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { CalendarEventItems, getMonth, setCalendarArrowsOpacity } from '@components/company'
import Calendar, { Detail } from 'react-calendar'
import useModal from '@modals/modal-hook'
// SERVICE
import EventService from '@services/event-service'
// STORE
import {
    $MonthEvents,
    $MonthEventsStates,
    fetchEvents,
    fetchMonthEvents, resetNotificationEvents,
    setMonthEventsData
} from '@store/company/event-store'
import { $UserRole, UserRoleEnum } from '@store/user-store'
// TYPES
import { CompanyTabPropsT } from '@interfaces/company/company'
import { EventShortDataT, EventT } from '@interfaces/company/event'
// STYLES
import style from '@scss/pages/company/company-calendar.module.scss'

const today = new Date()

const EventCalendar: React.FC<CompanyTabPropsT> = () => {
    // STORE
    const monthEvents = useStore($MonthEvents)
    const { isFetched } = useStore($MonthEventsStates)
    const userRole = useStore($UserRole)
    // STATES
    const [calendarView, setCalendarView] = useState<Detail>('month')
    const [currentDate, setCurrentDate] = useState<Date>(today)
    const [currentMonthAndYear, setCurrentMonthAndYear] = useState({ month: today.getMonth(), year: today.getFullYear() })
    const [currentMonthEvents, setCurrentMonthEvents] = useState<EventShortDataT[]>([])
    const [currentDayEvents, setCurrentDayEvents] = useState<EventT[]>([])
    const [states, setStates] = useState({
        error: false,
        isPending: true,
        monthEventsError: false
    })
    // TODO REMOVE ME LATER
    const [firstVisit, setFirstVisit] = useState(true)

    const { open } = useModal()

    useEffect(() => {
        if (!isFetched) {
            fetchMonthEvents({
                dateStart: new Date(today.getFullYear(), today.getMonth(), 1).getTime(),
                dateFinish: new Date(today.getFullYear(), today.getMonth() + 1, 1).getTime(),
                setStore: true,
                cb: (err, res) => {
                    if (err || !res) {
                        return setStates({ ...states, monthEventsError: true })
                    }
                    setCurrentMonthEvents(res.data)
                }
            })
        }
    }, [])

    useEffect(() => {
        if (currentMonthAndYear.month !== today.getMonth() || currentMonthAndYear.year !== today.getFullYear()) {
            fetchMonthEvents({
                dateStart: new Date(currentMonthAndYear.year, currentMonthAndYear.month, 1).getTime(),
                dateFinish: new Date(currentMonthAndYear.year, currentMonthAndYear.month + 1, 1).getTime(),
                cb: (err, res) => {
                    if (err || !res) {
                        return setStates({ ...states, monthEventsError: true })
                    }
                    setCurrentMonthEvents(res.data)
                }
            })
        } else {
            setCurrentMonthEvents(monthEvents)
        }
    }, [currentMonthAndYear])

    useEffect(() => {
        if (currentMonthAndYear.month !== currentDate.getMonth()
            || currentMonthAndYear.year !== currentDate.getFullYear()
        ) {
            setCurrentMonthAndYear({ month: currentDate.getMonth() , year: currentDate.getFullYear() })
        }
        setStates({ ...states, error: false, isPending: true })
        fetchEvents({
            dateStart: firstVisit ? 0 : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime(),
            dateFinish: firstVisit ? 0 : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1).getTime(),
            cb: (err, res) => {
                if (err || !res) {
                    return setStates({ ...states, error: true, isPending: false })
                }
                setCurrentDayEvents(res.data as EventT[])
                setStates({ ...states, error: false, isPending: false })
            }
        })
        setFirstVisit(false)
    }, [currentDate])

    // APPOINTING EVENT IN CALENDAR
    const tileContentHandler = useCallback(({ date, view }) => {
        let jsxArr: any = []

        if (view === 'month') {
            currentMonthEvents.forEach(event => {
                const eventStartDate = new Date(event.dateStart)
                const eventFinishDate = new Date(event.dateFinish)
                const isExpired = eventFinishDate.getTime() < today.getTime()

                if (
                    (eventStartDate.getDate() === date.getDate() &&
                        eventStartDate.getMonth() === date.getMonth() &&
                        eventStartDate.getFullYear() === date.getFullYear())
                    ||
                    (eventFinishDate.getDate() === date.getDate() &&
                        eventFinishDate.getMonth() === date.getMonth() &&
                        eventFinishDate.getFullYear() === date.getFullYear())
                ) {
                    jsxArr.push(
                        <p key={ Math.random() } className={ clsx([style.calendar_event, {
                            [style.green]: !isExpired && event.type === 'EVENT',
                            [style.yellow]: event.type === 'SIGNATURE',
                            [style.red]: isExpired,
                            [style.active]: event?.signature?.status === 1
                        }]) } />
                    )
                }
            })

            if (jsxArr.length > 0) {
                return (
                    <div className={ clsx(style.event_block) }>
                        { jsxArr.map((event: any) => event) }
                    </div>
                )
            }
        }
        return null
    }, [currentMonthEvents])

    // ADDING CUSTOM CLASSES TO CALENDAR DAY ITEM (WHEN ACTIVE || INACTIVE)
    const tileClassNameHandler = useCallback(({ date, view }) => {
        return view === 'month' && date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear() ?
            clsx([style.calendar_day_item, style.active]) : clsx(style.calendar_day_item)
    }, [])

    const onDelete = (id: number) => {
        EventService.DeleteEvent(id, (err, res) => {
            if (err) {
                return console.log('При удалении события произошла ошибка')
            }
            setCurrentDayEvents(currentDayEvents.filter(event => event.id !== id))
            const destroyedEventInMonthEvents = currentMonthEvents.find(event => event.id === id)
            if (destroyedEventInMonthEvents) {
                setCurrentMonthEvents(currentMonthEvents.filter(event => event.id !== id))
            }
        })
    }

    const onUpdate = (updatedEvent: EventT) => {
        const updatedEventDateStart = new Date(updatedEvent.dateStart)
        const updatedEventDateFinish = new Date(updatedEvent.dateFinish)
        if (
            (updatedEventDateStart.getDate() !== currentDate.getDate() ||
                updatedEventDateStart.getMonth() !== currentDate.getMonth() ||
                updatedEventDateStart.getFullYear() !== currentDate.getFullYear())
            ||
            (updatedEventDateFinish.getDate() !== currentDate.getDate() ||
                updatedEventDateFinish.getMonth() !== currentDate.getMonth() ||
                updatedEventDateFinish.getFullYear() !== currentDate.getFullYear())
        ) {
            return setCurrentDayEvents(currentDayEvents.filter(event => {
                if (event.id === updatedEvent.id) {
                    setCurrentMonthEvents(currentMonthEvents.map(monthEvent => {
                        if (monthEvent.id === updatedEvent.id) {
                            monthEvent.dateStart = updatedEvent.dateStart
                            monthEvent.dateFinish = updatedEvent.dateFinish
                        }
                        return monthEvent
                    }))
                    return false
                }
                return true
            }))
        }
        setCurrentDayEvents(currentDayEvents.map(event => {
            if (event.id === updatedEvent.id) {
                event = {
                    ...event,
                    title: updatedEvent.title,
                    desc: updatedEvent.desc,
                    dateStart: updatedEvent.dateStart,
                    dateFinish: updatedEvent.dateFinish
                }
                setCurrentMonthEvents(currentMonthEvents.map(monthEvent => {
                    if (monthEvent.id === updatedEvent.id) {
                        monthEvent.dateStart = event.dateStart
                        monthEvent.dateFinish = event.dateFinish
                    }
                    return monthEvent
                }))
            }
            return event
        }))
    }

    const handleEventCreation = (newEvent: EventT) => {
        const newEventDateStart = new Date(newEvent.dateStart)
        const newEventDateStartMonth = newEventDateStart.getMonth()
        const newEventDateStartYear = newEventDateStart.getFullYear()

        const newEventDateFinish = new Date(newEvent.dateFinish)
        const newEventDateFinishMonth = newEventDateFinish.getMonth()
        const newEventDateFinishYear = newEventDateFinish.getFullYear()

        // UPDATING CURRENT SELECTED DAY EVENTS STATE
        if ((newEventDateStart.getDate() === currentDate.getDate() &&
                newEventDateStartMonth === currentDate.getMonth() &&
                newEventDateStartYear === currentDate.getFullYear())
            ||
            (newEventDateFinish.getDate() === currentDate.getDate() &&
                newEventDateFinishMonth === currentDate.getMonth() &&
                newEventDateFinishYear === currentDate.getFullYear())
        ) {
            setCurrentDayEvents([...currentDayEvents, newEvent])
        }
        // UPDATING CURRENT SELECTED MONTH EVENTS STATE
        if ((newEventDateStartMonth === currentMonthAndYear.month
                && newEventDateStartYear === currentMonthAndYear.year)
            ||
            (newEventDateFinishMonth === currentMonthAndYear.month
                && newEventDateFinishYear === currentMonthAndYear.year)
        ) {
            setCurrentMonthEvents([...currentMonthEvents, newEvent])
        }
        // UPDATING MONTH EVENTS STORE
        if ((newEventDateStartMonth === today.getMonth()
                && newEventDateStartYear === today.getFullYear())
            ||
            (newEventDateFinishMonth === today.getMonth()
                && newEventDateFinishYear === today.getFullYear())
        ) {
            setMonthEventsData([...monthEvents, newEvent])
        }
        // RESETTING NOTIFICATION EVENTS & STATES TO FETCH IT AGAIN ON GOING TO THE PAGE
        resetNotificationEvents()
    }

    return (
        <section className="tab-content-item">
            <div className={ clsx(style.calendar_section) }>
                <div className={ clsx(style.calendar_panel) }>
                    <div className={ clsx(style.calendar_control__panel) }>
                        <div className={clsx(style.calendar_control__panel)}>
                            <button className={clsx(style.year_btn)} onClick={ () => {
                                setCalendarArrowsOpacity('0')
                                setCalendarView('year')
                            } }>
                                { getMonth(currentDate.getMonth()) }
                                <img src="/img/static/black-arrow-drop.png" alt="" className={clsx(style.calendar_control__arrow_down)}/>
                            </button>
                            <button className={clsx(style.month_btn)} onClick={ () => {
                                setCalendarArrowsOpacity('1')
                                setCalendarView('decade')
                            } }>
                                { currentDate.getFullYear() }
                                <img src="/img/static/black-arrow-drop.png" alt="" className={clsx(style.calendar_control__arrow_down)} />
                            </button>
                        </div>
                    </div>
                    <Calendar
                        tileContent={ tileContentHandler }
                        onClickYear={() => setCalendarArrowsOpacity('0')}
                        view={ calendarView }
                        onViewChange={({ view }) => setCalendarView(view)}
                        locale={'ru-RU'}
                        value={currentDate}
                        prev2Label={null}
                        next2Label={null}
                        prevLabel={
                            <svg xmlns="http://www.w3.org/2000/svg" className={clsx(style.calendar_control__btn, style.calendar_prev_btn)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        }
                        nextLabel={
                            <svg xmlns="http://www.w3.org/2000/svg" className={clsx(style.calendar_control__btn, style.calendar_next_btn)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>}
                        tileClassName={ tileClassNameHandler }
                        onChange={(date) => setCurrentDate(date)}
                    />
                </div>
                {/* EVENTS PANEL */ }
                <div className={ clsx(style.events_panel) }>
                    {/* EVENT PANEL TOP CONTENT */ }
                    <div className={ clsx(style.events_panel__top_content) }>
                        <p className={ clsx(style.today_text) }>Сегодня, { today.getDate() } { getMonth(today.getMonth(), true) }</p>
                        <div className={ clsx(style.selected_calendar_date) }>
                            <p className={ clsx(style.selected_calendar_date__text) }>
                                { currentDate.getDate() } { getMonth(currentDate.getMonth(), true) }
                            </p>
                        </div>
                        {
                            userRole === UserRoleEnum.Client ? null :
                                <button className={ clsx(style.calendar_create_event_btn) }
                                        onClick={ () => open('CreateEventModal', {
                                            btnText: 'Создать',
                                            modalData: { modalTitle: 'Создать ивент' },
                                            onConfirm: handleEventCreation
                                        }) }>
                                    Создать событие <img src="/img/plus.png" alt="" />
                                </button>
                        }
                    </div>
                    {/* EVENT ITEMS */ }
                    <div className={ clsx(style.events_panel__event_items) }>
                        <CalendarEventItems
                            events={ currentDayEvents }
                            error={ states.error }
                            isPending={ states.isPending }
                            onDelete={ onDelete }
                            onUpdate={ onUpdate }
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventCalendar