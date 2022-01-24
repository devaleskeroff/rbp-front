// SERVICE
import FeedbackService from '@services/feedback-service'
// TYPES
import { createStore, createEffect, createEvent } from 'effector'
import { FeedbackT } from '@interfaces/feedback'
import { EventStateStoreT } from '@interfaces/common'

// FEEDBACK ITEMS
const setFeedbackItems = createEvent<FeedbackT[]>()
const pushToFeedbackItems = createEvent<FeedbackT>()

export const $FeedbackItems = createStore<FeedbackT[]>([])
    .on(setFeedbackItems, (_, newData) => newData)
    .on(pushToFeedbackItems, (oldState, newFeedback) => [newFeedback, ...oldState])

// SINGLE FEEDBACK ITEM
export const setFeedbackItem = createEvent<FeedbackT | false>()

export const $FeedbackItem = createStore<FeedbackT | null | false>(null)
    .on(setFeedbackItem, (_, newData) => newData)

// FEEDBACK STATES
export const setFeedbackState = createEvent<EventStateStoreT>()

export const $FeedbackStates = createStore<EventStateStoreT>({ isFetched: false, isLoading: true, error: false })
    .on(setFeedbackState, (_, newData) => newData)

// FETCHING DATA
export const fetchFeedbackItems = createEffect(async () => {
    setFeedbackState({ isFetched: false, error: false, isLoading: true })

    FeedbackService.GetFeedbacks((err, res) => {
        if (err || !res) {
            console.log(err)
            return setFeedbackState({ isFetched: false, error: true, isLoading: false })
        }
        setFeedbackState({ isFetched: true, error: false, isLoading: false })
        res.data = res.data.map(item => {
            /* ARRAY IN STRING TYPE SO NEEDS TO PARSING */
            item.files = JSON.parse(item.files as unknown as string)
            return item
        })
        setFeedbackItems(res.data)
    })
})

export const createFeedback = createEffect<(params: { formData: FormData, cb: () => void }) => void>(async (params) => {
    FeedbackService.CreateFeedback(params.formData, (err, res) => {
        if (err || !res) {
            return console.log('При создании нового запроса произошла ошибка')
        }
        /* ARRAY IN STRING TYPE SO NEEDS TO PARSING */
        res.data.files = JSON.parse(res.data.files as unknown as string)
        res.data.answeredAt = Date.now()

        pushToFeedbackItems(res.data)
        params.cb()
    })
})

export const fetchFeedbackItem = createEffect(async ({ id }: { id: number }) => {
    FeedbackService.GetFeedback(id, (err, res) => {
        if (err || !res) {
            console.log(err)
            return setFeedbackItem(false)
        }
        res.data.files = JSON.parse(res.data.files as unknown as string)
        setFeedbackItem(res.data)
    })
})

export const respondToFeedback = createEffect<(params: { id: number, answer: string, cb: () => void }) => void>(async ({ id, answer, cb}) => {
    FeedbackService.RespondToFeedback(id, answer, (err, res) => {
        if (err || !res) {
            return console.log('При отправке ответа произошла ошибка')
        }
        setFeedbackItems($FeedbackItems.getState().map(feedback => {
            if (feedback.id === id) {
                feedback.answer = answer
            }
            return feedback
        }))
        if ($FeedbackItem.getState()) {
            setFeedbackItem({
                ...$FeedbackItem.getState() as FeedbackT,
                answer
            })
        }
        cb()
    })
})




