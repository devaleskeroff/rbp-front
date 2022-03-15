import { createEffect, createEvent, createStore } from 'effector'
// SERVICE
import WorkerService from '@services/worker-service'
// STORE
import { resetAllStates } from '@store/user-store'
// TYPES
import { EventStateStoreT } from '@interfaces/common'
import { WorkerShortDataT } from '@interfaces/user'

// WORKERS DATA
const setWorkersData = createEvent<WorkerShortDataT[]>()
export const updateWorkerData = createEvent<WorkerShortDataT>()
export const pushToWorkersData = createEvent<WorkerShortDataT>()

export const $Workers = createStore<WorkerShortDataT[]>([])
    .on(setWorkersData, (_, newState) => newState)
    .on(updateWorkerData, (oldState, newState) => {
        return oldState.map(worker => {
            if (worker.id === newState.id) {
                worker = newState
            }
            return worker
        })
    })
    .on(pushToWorkersData, (oldState, newState) => [...oldState, newState])
    .reset(resetAllStates)

// WORKERS DATA STATE
export const setWorkersStates = createEvent<EventStateStoreT>()
export const setWorkersLoading = createEvent<boolean>()
export const setWorkersError = createEvent<boolean>()
export const serWorkersStates = createEvent<EventStateStoreT>()

export const $WorkersDataStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setWorkersStates, (oldState, newState) => newState)
    .on(setWorkersLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setWorkersError, (oldState, newState) => ({ ...oldState, isLoading: false, error: newState }))
    .on(serWorkersStates, (_, newState) => newState)
    .reset(resetAllStates)

export const getWorkers = createEffect<(params: { adminId: number }) => void>(({ adminId }) => {
    setWorkersLoading(true)

    WorkerService.GetWorkers(adminId, (err, res) => {
        if (err || !res) {
            setWorkersStates({ error: true, isFetched: false, isLoading: false })
            return console.log('При получении данных пользователей произошла ошибка')
        }
        setWorkersData(res.data)
        setWorkersStates({ error: false, isFetched: true, isLoading: false })
    })
})
