import React, { useCallback, useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import { Title } from '@components/common/common'
import { Categories } from '@components/common/category-tag-switcher'
import EventItems from '@components/events'
import { ErrorIndicator, Loader } from '@ui/indicators'
// STORE
import {
    $NotificationEventsData,
    $NotificationEventsStates,
    fetchEvents, setNotificationEvents,
    setNotificationEventsData,
    setNotificationEventsStates
} from '@store/company/event-store'
// TYPES
import { EventsWithCountT, EventT } from '@interfaces/company/event'
// STYLES
import style from '@scss/pages/notifications.module.scss'

const itemsPerPage = 9
// FIXME ALL LOGIC IN FUTURE
const Notifications = () => {
    // STORES
    const { isFetched, isLoading, error } = useStore($NotificationEventsStates)
    const events = useStore($NotificationEventsData)
    // STATES
    const [offsets, setOffsets] = useState({
        commonOffset: 0,
        simpleEventsOffset: 0,
        signatureEventsOffset: 0
    })
    const [category, setCategory] = useState<string | null>(null)
    const [currentCategoryEvents, setCurrentCategoryEvents] = useState<EventT[]>([])
    const [simpleEvents, setSimpleEvents] = useState<EventT[]>([])
    const [signatureEvents, setSignatureEvents] = useState<EventT[]>([])
    const [currentCategoryEventsCount, setCurrentCategoryEventsCount] = useState(0)
    const [states, setStates] = useState({
        simpleEventsFetched: false,
        signatureEventsFetched: false
    })

    useEffect(() => {
        if (!isFetched) {
            fetchEvents({
                dateStart: null,
                dateFinish: null,
                skip: 0,
                limit: itemsPerPage,
                count: true,
                cb: (err, res) => {
                    if (err || !res) {
                        return setNotificationEventsStates({ isFetched: false, isLoading: false, error: true })
                    }
                    setOffsets({ ...offsets, commonOffset: itemsPerPage })
                    setNotificationEventsData(res.data as EventsWithCountT)
                    setNotificationEventsStates({ isFetched: true, isLoading: false, error: false })
                    setCurrentCategoryEvents((res.data as EventsWithCountT).events)
                    setCurrentCategoryEventsCount(
                        (res.data as EventsWithCountT).simpleEventsCount +
                        (res.data as EventsWithCountT).signatureEventsCount
                    )
                }
            })
        }
    }, [])

    const fetchMoreEvents = useCallback(() => {
        let offset: number
        let type: any
        switch (category) {
            case 'SIGNATURE':
                type = 'SIGNATURE'
                offset = offsets.signatureEventsOffset
                if (!states.signatureEventsFetched) setNotificationEventsStates({ isFetched: true, isLoading: true, error: false })
                break
            case 'EVENT':
                type = 'EVENT'
                offset = offsets.simpleEventsOffset
                if (!states.signatureEventsFetched) setNotificationEventsStates({ isFetched: true, isLoading: true, error: false })
                break
            default:
                type = undefined
                offset = offsets.commonOffset
        }

        fetchEvents({
            dateStart: null,
            dateFinish: null,
            skip: offset,
            limit: itemsPerPage,
            type,
            cb: (err, res) => {
                if (err || !res) {
                    return console.log('Произошла ошибка при получении событий')
                }
                setNotificationEventsStates({ isFetched: true, isLoading: false, error: false })

                if (type === 'EVENT') {
                    if (!states.simpleEventsFetched) {
                        setStates({ ...states, simpleEventsFetched: true })
                    }
                    setSimpleEvents([...simpleEvents, ...res.data as EventT[]])
                    setOffsets({ ...offsets, simpleEventsOffset: offset + (res.data as EventT[]).length })
                    return
                }
                if (type === 'SIGNATURE') {
                    if (!states.signatureEventsFetched) {
                        setStates({ ...states, signatureEventsFetched: true })
                    }
                    setSignatureEvents([...signatureEvents, ...res.data as EventT[]])
                    setOffsets({ ...offsets, signatureEventsOffset: offset + (res.data as EventT[]).length })
                    return
                }
                setOffsets({ ...offsets, commonOffset: offset + (res.data as EventT[]).length })
                setNotificationEvents(res.data as EventT[])
            }
        })
    }, [category, offsets, states])

    useEffect(() => {
        if (!category) {
            return setCurrentCategoryEvents(events.events)
        }
        if (category === 'SIGNATURE') {
            return setCurrentCategoryEvents(signatureEvents)
        }
        if (category === 'EVENT') {
            return setCurrentCategoryEvents(simpleEvents)
        }
    }, [simpleEvents, signatureEvents, events])

    useEffect(() => {
        if (!category) {
            setCurrentCategoryEventsCount(events.signatureEventsCount + events.simpleEventsCount)
            return setCurrentCategoryEvents(events.events)
        }
        if (category === 'SIGNATURE') {
            setCurrentCategoryEventsCount(events.signatureEventsCount)
            setCurrentCategoryEvents(signatureEvents)
            if (!states.signatureEventsFetched) {
                fetchMoreEvents()
            }
            return
        }
        if (category === 'EVENT') {
            setCurrentCategoryEventsCount(events.simpleEventsCount)
            setCurrentCategoryEvents(simpleEvents)
            if (!states.simpleEventsFetched) {
                fetchMoreEvents()
            }
            return
        }
    }, [category])

    const onCategoryChanging = ({ target }: any) => {
        let selectedCategoryId: null | string = target.getAttribute('datatype')

        selectedCategoryId = selectedCategoryId === 'ANY' ? null : selectedCategoryId
        setCategory(selectedCategoryId)
    }

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Оповещения'] }/>
                    <div className="content-title-section-with-btn">
                        <Title text="Оповещения"/>
                    </div>
                </div>
                <div className={ clsx(style.content_container) }>
                    {/* CATEGORIES */ }
                    <Categories
                        onClick={ onCategoryChanging }
                        items={ [
                            { value: 'ANY', label: 'Общее' },
                            { value: 'SIGNATURE', label: 'Переподписания' },
                            { value: 'SIGNATURE', label: 'Ивенты' }
                        ] }
                    />
                    <div className={ clsx(style.events_container) }>
                        {/* EVENT ITEMS */}
                        {
                            error ? <ErrorIndicator /> : isLoading ? <Loader height={ 350 } /> :
                            <EventItems events={ currentCategoryEvents } />
                        }
                        {
                            !isLoading && currentCategoryEvents.length < currentCategoryEventsCount ?
                                <button className='pagination-button' onClick={fetchMoreEvents}>
                                    Показать еще
                                </button> : null
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Notifications