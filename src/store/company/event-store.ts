import { createEvent, createStore } from 'effector'
import { createEffect } from 'effector/compat'
// SERVICE
import EventService from '@services/event-service'
// STORE
import { resetAllStates } from '@store/user-store'
// TYPES
import {
    EventShortDataT, EventsWithCountT,
    EventT,
    FetchingEventsDataPropsT,
    FetchingMonthEventsDataPropsT
} from '@interfaces/company/event'
import { EventStateStoreT } from '@interfaces/common'

/** EVENTS FOR CALENDAR PAGE **/
// MONTH EVENTS DATA
export const setMonthEventsData = createEvent<EventShortDataT[]>()
export const pushToMonthEventsData = createEvent<EventShortDataT[]>()

export const $MonthEvents = createStore<EventShortDataT[]>([])
    .on(setMonthEventsData, (_, newData) => newData)
    .on(pushToMonthEventsData, (oldState, newEvents) => [...oldState, ...newEvents])
    .reset(resetAllStates)

// MONTH EVENTS STATES
export const setMonthEventsStates = createEvent<EventStateStoreT>()

export const $MonthEventsStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setMonthEventsStates, (_, newState) => newState)
    .reset(resetAllStates)

/** EVENTS FOR NOTIFICATION & HOME PAGES **/
// NOTIFICATION EVENTS DATA
export const setNotificationEvents = createEvent<EventT[]>()
export const setNotificationEventsData = createEvent<EventsWithCountT>()
export const resetNotificationEvents = createEvent()

export const $NotificationEventsData = createStore<EventsWithCountT>({
    simpleEventsCount: 0,
    signatureEventsCount: 0,
    events: []
})
    .on(setNotificationEventsData, (_, newState) => newState)
    .on(setNotificationEvents, (oldState, newState) => ({
        simpleEventsCount: oldState.simpleEventsCount,
        signatureEventsCount: oldState.signatureEventsCount,
        events: [...oldState.events, ...newState],
    }))
    .reset(resetAllStates)
    .reset(resetNotificationEvents)

// NOTIFICATION EVENTS STATES
export const setNotificationEventsStates = createEvent<EventStateStoreT>()

export const $NotificationEventsStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setNotificationEventsStates, (_, newState) => newState)
    .reset(resetAllStates)
    .reset(resetNotificationEvents)

// MONTH EVENTS REQUEST
export const fetchMonthEvents = createEffect<FetchingMonthEventsDataPropsT>(async ({ dateStart, dateFinish, setStore, cb }) => {
    EventService.GetMonthEvents(dateStart, dateFinish, (err, res) => {
        if (err || !res) {
            if (setStore) {
                setMonthEventsStates({ isLoading: false, isFetched: false, error: true })
            }
            if (cb) {
                return cb(err)
            }
            return
        }
        if (setStore) {
            setMonthEventsData(res.data)
            setMonthEventsStates({ isLoading: false, isFetched: true, error: false })
        }
        if (cb) {
            return cb(null, res)
        }
    })
})

// DAY EVENTS REQUEST
export const fetchEvents = createEffect<FetchingEventsDataPropsT>(async (props) => {
    const { dateStart, dateFinish, type, skip, limit, count, cb } = props

    EventService.GetEvents({ dateStart, dateFinish, type, skip, limit, count }, (err, res) => {
        if (err) {
            if (cb) return cb(err)
        }
        if (cb) return cb(null, res)
    })
})
