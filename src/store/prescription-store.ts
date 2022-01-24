// SERVICE
import PrescriptionService from '@services/prescription-service'
// TYPES
import { createEffect, createEvent, createStore } from 'effector'
import {
    FetchPrescriptionsPropsT, PrescriptionExecutorsStateT,
    PrescriptionExecutorT,
    PrescriptionStoreT,
    PrescriptionT,
} from '@interfaces/prescriptions'
import { EventStateStoreT } from '@interfaces/common'

// PRESCRIPTIONS
export const setPrescriptions = createEvent<PrescriptionStoreT>()
export const pushToPrescriptions = createEvent<PrescriptionT[]>()
export const updatePrescription = createEvent<PrescriptionT>()
export const removePrescription = createEvent<number>()

export const $Prescriptions = createStore<PrescriptionStoreT>({ count: 0, rows: [] })
    .on(setPrescriptions, (_, newState) => newState)
    .on(pushToPrescriptions, (oldState, newState) => ({
        count: ++oldState.count,
        rows: [...oldState.rows, ...newState]
    }))
    .on(updatePrescription, (oldState, updatedPrescription) => ({
        count: oldState.count,
        rows: oldState.rows.map(prescription => {
            if (prescription.id === updatedPrescription.id) {
                prescription = updatedPrescription
            }
            return prescription
        })
    }))
    .on(removePrescription, (oldState, prescriptionId) => ({
        count: --oldState.count,
        rows: oldState.rows.filter(prescription => prescription.id !== prescriptionId)
    }))

// PRESCRIPTIONS STATES
export const setPrescriptionsStates = createEvent<EventStateStoreT>()

export const $PrescriptionsStates = createStore<EventStateStoreT>({ isFetched: false, isLoading: true, error: false })
    .on(setPrescriptionsStates, (_, newState) => newState)

// SELECTED PRESCRIPTION
export const setSelectedPrescription = createEvent<PrescriptionT>()
export const resetSelectedPrescription = createEvent()

export const $SelectedPrescription = createStore<PrescriptionT | null>(null)
    .on(setSelectedPrescription, (_, newState) => newState)
    .reset(resetSelectedPrescription)

// PRESCRIPTION EXECUTORS
export const setPrescriptionExecutorsState = createEvent<PrescriptionExecutorsStateT>()
export const pushToPrescriptionExecutors = createEvent<PrescriptionExecutorT[]>()

export const $PrescriptionExecutors = createStore<PrescriptionExecutorsStateT>({ count: 0, rows: [] })
    .on(setPrescriptionExecutorsState, (_, newState) => newState)
    .on(pushToPrescriptionExecutors, (oldState, newState) => ({
        count: oldState.count,
        rows: [...oldState.rows, ...newState]
    }))


// PRESCRIPTION EXECUTORS STATES
export const setExecutorsStates = createEvent<EventStateStoreT>()

export const $ExecutorsStates = createStore<EventStateStoreT>({ isFetched: false, isLoading: true, error: false })
    .on(setExecutorsStates, (_, newState) => newState)

// REQUESTS
export const fetchPrescriptions = createEffect<FetchPrescriptionsPropsT>(({ offset, limit, count, cb }) => {
    PrescriptionService.GetPrescriptions(offset, limit, count, (err, res) => {
        if (err || !res) {
            setPrescriptionsStates({ isFetched: false, error: true, isLoading: false })
            if (cb) {
                cb(err)
            }
            return console.log('При получении предписаний произошла ошибка')
        }
        if (count) {
            setPrescriptions(res.data)
        } else {
            pushToPrescriptions(res.data.rows)
        }
        setPrescriptionsStates({ isFetched: true, error: false, isLoading: false })
        if (cb) {
            cb(null, res)
        }
    })
})

export const fetchPrescriptionExecutors = createEffect((props?: { offset?: number, search?: string, count?: boolean, cb?: () => void }) => {
    PrescriptionService.GetPrescriptionExecutors(
        typeof props?.offset === 'number' ? props.offset : $PrescriptionExecutors.getState().rows.length,
        props?.search || null,
        props?.count || false,
        (err, res) => {
        if (err || !res) {
            setExecutorsStates({ isFetched: false, error: true, isLoading: false })
            if (props?.cb) {
                props?.cb()
            }
            return console.log('При получении списка исполнителей произошла ошибка')
        }
        if (props?.count || props?.search) {
            setPrescriptionExecutorsState({
                count: res.data.count!,
                rows: res.data.rows
            })
        } else {
            pushToPrescriptionExecutors(res.data.rows)
        }

        setExecutorsStates({ isFetched: true, error: false, isLoading: false })
        if (props?.cb) {
            props?.cb()
        }
    })
})