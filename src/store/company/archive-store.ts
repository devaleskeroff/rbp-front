import { createEvent, createStore } from 'effector'
// STORE
import { resetAllStates } from '@store/user-store'
// TYPES
import { EventStateStoreT } from '@interfaces/common'
import {
    ArchiveDirectoryDataT,
    ArchiveEmployeeDataT,
    ArchiveFileT,
} from '@interfaces/company/archive'

// ARCHIVE COMMON DOCUMENTS
export const setArchiveCommonDocuments = createEvent<[Array<ArchiveDirectoryDataT>, Array<ArchiveFileT>]>()
export const pushToArchiveCommonDocuments = createEvent<[ArchiveDirectoryDataT | null, ArchiveFileT | null]>()

export const $ArchiveCommonDocuments = createStore<[Array<ArchiveDirectoryDataT>, Array<ArchiveFileT>]>([[], []])
    .on(setArchiveCommonDocuments, (_, newState) => newState)
    .on(pushToArchiveCommonDocuments, (oldState, newState) => {
        if (newState[0]) {
            oldState[0].unshift(newState[0])
        }
        if (newState[1]) {
            oldState[1].unshift(newState[1])
        }
        return oldState
    })
    .reset(resetAllStates)

// ARCHIVE CURRENT DOCUMENTS
export const setArchiveCurrentDocuments = createEvent<[Array<ArchiveDirectoryDataT>, Array<ArchiveFileT>]>()

export const $ArchiveCurrentDocuments = createStore<[Array<ArchiveDirectoryDataT>, Array<ArchiveFileT>]>([[], []])
    .on(setArchiveCurrentDocuments, (_, newState) => newState)
    .reset(resetAllStates)

// ARCHIVE EMPLOYEES
export const setArchiveEmployees = createEvent<ArchiveEmployeeDataT[]>()
export const pushToArchiveEmployees = createEvent<ArchiveEmployeeDataT>()

export const $ArchiveEmployees = createStore<ArchiveEmployeeDataT[]>([])
    .on(setArchiveEmployees, (_, newState) => newState)
    .on(pushToArchiveEmployees, (oldState, newState) => [newState, ...oldState])
    .reset(resetAllStates)

// ARCHIVE DOCUMENTS EVENT STATES
export const setArchiveDocumentsLoading = createEvent<boolean>()
export const setArchiveDocumentsError = createEvent<boolean>()
export const setArchiveDocumentsFetched = createEvent<boolean>()

export const $ArchiveDocumentsStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setArchiveDocumentsLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setArchiveDocumentsError, (oldState, newState) => ({ ...oldState, isLoading: false, error: newState }))
    .on(setArchiveDocumentsFetched, (oldState, newState) => ({ ...oldState, isFetched: newState }))
    .reset(resetAllStates)

// ARCHIVE EMPLOYEES EVENT STATES
export const setArchiveEmployeesLoading = createEvent<boolean>()
export const setArchiveEmployeesError = createEvent<boolean>()
export const setArchiveEmployeesFetched = createEvent<boolean>()

export const $ArchiveEmployeesStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setArchiveEmployeesLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setArchiveEmployeesError, (oldState, newState) => ({ ...oldState, isLoading: false, error: newState }))
    .on(setArchiveEmployeesFetched, (oldState, newState) => ({ ...oldState, isFetched: newState }))
    .reset(resetAllStates)