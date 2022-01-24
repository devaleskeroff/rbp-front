import { createEffect, createEvent, createStore } from 'effector'
// SERVICE
import NewsService from '@services/news-service'
// TYPES
import { FetchingNewsPropsT, NewsActionsT, NewsT } from '@interfaces/news'
import { EventStateStoreT } from '@interfaces/common'
import { resetAllStates } from '@store/user-store'

/** NEWS **/
export const appendToNews = createEvent<NewsT | NewsT[]>()
export const prependToNews = createEvent<NewsT>()
export const updateNews = createEvent<NewsT>()
export const removeItemFromNews = createEvent<number>()

export const $News = createStore<Array<NewsT>>([])
    .on(appendToNews, (oldState, newState) => {
        if (newState instanceof Array) {
            return [...oldState, ...newState]
        }
        return [...oldState, newState]
    })
    .on(prependToNews, (oldState, newState) => {
        setNewsCount($NewsCount.getState().news + 1)
        return [newState, ...oldState]
    })
    .on(updateNews, (oldState, updatedItem) => oldState.map(item => {
        if (item.id === updatedItem.id) {
            item = updatedItem
        }
        return item
    }))
    .on(removeItemFromNews, (oldState, id) => {
        setNewsCount($NewsCount.getState().news - 1)
        return oldState.filter(item => item.id !== id)
    })
    .reset(resetAllStates)

// NEWS STATES
export const setNewsStates = createEvent<EventStateStoreT>()
export const setNewsLoading = createEvent<boolean>()

export const $NewsStates = createStore<EventStateStoreT>({ isFetched: false, isLoading: true, error: false })
    .on(setNewsStates, (_, newState) => newState)
    .on(setNewsLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .reset(resetAllStates)

/** PRACTICES **/
export const appendToPractices = createEvent<NewsT | NewsT[]>()
export const prependToPractices = createEvent<NewsT>()
export const updatePractice = createEvent<NewsT>()
export const removeItemFromPractices = createEvent<number>()

export const $Practices = createStore<Array<NewsT>>([])
    .on(appendToPractices, (oldState, newState) => {
        if (newState instanceof Array) {
            return [...oldState, ...newState]
        }
        return [...oldState, newState]
    })
    .on(prependToPractices, (oldState, newState) => {
        setPracticesCount($NewsCount.getState().practices + 1)
        return [newState, ...oldState]
    })
    .on(updatePractice, (oldState, updatedItem) => oldState.map(item => {
        if (item.id === updatedItem.id) {
            item = updatedItem
        }
        return item
    }))
    .on(removeItemFromPractices, (oldState, id) => {
        setPracticesCount($NewsCount.getState().practices - 1)
        return oldState.filter(item => item.id !== id)
    })
    .reset(resetAllStates)

// PRACTICES STATES
export const setPracticesStates = createEvent<EventStateStoreT>()
export const setPracticesLoading = createEvent<boolean>()

export const $PracticesStates = createStore<EventStateStoreT>({ isFetched: false, isLoading: true, error: false })
    .on(setPracticesStates, (_, newState) => newState)
    .on(setPracticesLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .reset(resetAllStates)

/** SPEC HELPS **/
export const appendToSpecHelps = createEvent<NewsT | NewsT[]>()
export const prependToSpecHelps = createEvent<NewsT>()
export const updateSpecHelp = createEvent<NewsT>()
export const removeItemFromSpecHelps = createEvent<number>()

export const $SpecHelps = createStore<Array<NewsT>>([])
    .on(appendToSpecHelps, (oldState, newState) => {
        if (newState instanceof Array) {
            return [...oldState, ...newState]
        }
        return [...oldState, newState]
    })
    .on(prependToSpecHelps, (oldState, newState) => {
        setSpecHelpsCount($NewsCount.getState().specHelps + 1)
        return [newState, ...oldState]
    })
    .on(updateSpecHelp, (oldState, updatedItem) => oldState.map(item => {
        if (item.id === updatedItem.id) {
            item = updatedItem
        }
        return item
    }))
    .on(removeItemFromSpecHelps, (oldState, id) => {
        setSpecHelpsCount($NewsCount.getState().specHelps - 1)
        return oldState.filter(item => item.id !== id)
    })
    .reset(resetAllStates)

// SPEC HELPS STATES
export const setSpecHelpsStates = createEvent<EventStateStoreT>()
export const setSpecHelpsLoading = createEvent<boolean>()

export const $SpecHelpsStates = createStore<EventStateStoreT>({ isFetched: false, isLoading: true, error: false })
    .on(setSpecHelpsStates, (_, newState) => newState)
    .on(setSpecHelpsLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .reset(resetAllStates)

/** NEWS, PRACTICES AND SPEC HELPS COUNT(ALL ITEMS COUNT FOR PAGINATE) **/
const setNewsCount = createEvent<number>()
const setPracticesCount = createEvent<number>()
const setSpecHelpsCount = createEvent<number>()

export const $NewsCount = createStore({ news: 0, practices: 0, specHelps: 0 })
    .on(setNewsCount, (oldState, newState) => ({ ...oldState, news: newState }))
    .on(setPracticesCount, (oldState, newState) => ({ ...oldState, practices: newState }))
    .on(setSpecHelpsCount, (oldState, newState) => ({ ...oldState, specHelps: newState }))
    .reset(resetAllStates)

// NEWS DATA FOR UPDATING
export const setSelectedNewsData = createEvent<NewsT | null>()

export const $SelectedNewsData = createStore<NewsT | null>(null)
    .on(setSelectedNewsData, (_, newState) => newState)

// NEWS ACTION TYPE
export const setNewsActionType = createEvent<NewsActionsT>()

export const $NewsActionType = createStore<NewsActionsT>('createNews')
    .on(setNewsActionType, (_, newState) => newState)

// REQUESTS
export const fetchNews = createEffect<FetchingNewsPropsT>(({ skip, limit, count, cb }) => {
    NewsService.GetNews({ skip, limit, type: 'NEWS', count }, (err, res) => {
        if (err || !res) {
            setNewsStates({ error: true, isFetched: false, isLoading: false })
            if (cb) {
                cb(err)
            }
            return
        }
        setNewsStates({ error: false, isFetched: true, isLoading: false })
        appendToNews(res.data.rows)
        if (count) {
            setNewsCount(res.data.count as number)
        }
        if (cb) {
            cb(null, res)
        }
    })
})

export const fetchPractices = createEffect<FetchingNewsPropsT>(({ skip, limit, count, cb }) => {
    NewsService.GetNews({ skip, limit, type: 'PRACTICE', count }, (err, res) => {
        if (err || !res) {
            setPracticesStates({ error: true, isFetched: false, isLoading: false })
            if (cb) {
                cb(err)
            }
            return
        }
        setPracticesStates({ error: false, isFetched: true, isLoading: false })
        appendToPractices(res.data.rows)
        if (count) {
            setPracticesCount(res.data.count as number)
        }
        if (cb) {
            cb(null, res)
        }
    })
})

export const fetchSpecHelps = createEffect<FetchingNewsPropsT>(({ skip, limit, count, cb }) => {
    NewsService.GetNews({ skip, limit, type: 'SPEC_HELP', count }, (err, res) => {
        if (err || !res) {
            setSpecHelpsStates({ error: true, isFetched: false, isLoading: false })
            if (cb) {
                cb(err)
            }
            return
        }
        setSpecHelpsStates({ error: false, isFetched: true, isLoading: false })
        appendToSpecHelps(res.data.rows)
        if (count) {
            setSpecHelpsCount(res.data.count as number)
        }
        if (cb) {
            cb(null, res)
        }
    })
})