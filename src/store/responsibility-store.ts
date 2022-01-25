import { createEvent, createStore } from 'effector'
// TYPES
import {
    CommonResponsibilityDocsStoreT,
    ResponsibilityDirectoryT,
    ResponsibilityFileT
} from '@interfaces/responsibility'
import { EventStateStoreT } from '@interfaces/common'

// RESPONSIBILITY COMMON DOCUMENTS (INITIAL PAGE)
export const setResponsibilityCommonDocs = createEvent<CommonResponsibilityDocsStoreT>()
export const pushToResponsibilityCommonDocs = createEvent<[ResponsibilityFileT | null, ResponsibilityDirectoryT | null]>()

export const $CommonResponsibilityDocuments = createStore<CommonResponsibilityDocsStoreT>([[], []])
    .on(setResponsibilityCommonDocs, (_, newState) => newState)
    .on(pushToResponsibilityCommonDocs, (oldState, newState) => {
        if (newState[0]) {
            oldState[0].push(newState[0])
        }
        if (newState[1]) {
            oldState[1].push(newState[1])
        }
        return oldState
    })

// RESPONSIBILITY DOCUMENTS
export const setResponsibilityDocuments = createEvent<CommonResponsibilityDocsStoreT>()
export const pushToResponsibilityDocs = createEvent<[ResponsibilityFileT | null, ResponsibilityDirectoryT | null]>()

export const $ResponsibilityDocuments = createStore<CommonResponsibilityDocsStoreT>([[], []])
    .on(setResponsibilityDocuments, (_, newState) => newState)
    .on(pushToResponsibilityDocs, (oldState, newState) => {
        if (newState[0]) {
            oldState[0].push(newState[0])
        }
        if (newState[1]) {
            oldState[1].push(newState[1])
        }
        return oldState
    })

// COMMON DOCUMENTS STATES
export const setResponsibilityStates = createEvent<EventStateStoreT>()
export const setResponsibilityLoading = createEvent<boolean>()
export const setResponsibilityError = createEvent<boolean>()

export const $ResponsibilityStates = createStore<EventStateStoreT>({ isFetched: false, isLoading: true, error: false })
    .on(setResponsibilityStates, (_, newState) => newState)
    .on(setResponsibilityLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setResponsibilityError, (oldState, newState) => ({ ...oldState, error: newState }))