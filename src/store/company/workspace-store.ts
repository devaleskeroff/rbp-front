import { createEffect, createEvent, createStore } from 'effector'
// SERVICES
import WorkspaceService from '@services/workspace-service'
// STORE
import { resetAllStates } from '@store/user-store'
// TYPES
import {
    WorkspaceDirectoryShortDataT,
    WorkspaceFileShortDataT,
    WorkspaceGroupT
} from '@interfaces/company/workspace'
import { EventStateStoreT } from '@interfaces/common'

// GROUPS
export const setWpGroups = createEvent<WorkspaceGroupT[]>()

export const $WpGroups = createStore<WorkspaceGroupT[]>([])
    .on(setWpGroups, (_, newState) => newState)
    .reset(resetAllStates)

// DIRECTORIES
export const setWpDirectories = createEvent<WorkspaceDirectoryShortDataT[]>()

export const $WpDirectories = createStore<WorkspaceDirectoryShortDataT[]>([])
    .on(setWpDirectories, (_, newState) => newState)
    .reset(resetAllStates)

// FILES
export const setWpFiles = createEvent<WorkspaceFileShortDataT[]>()

export const $WpFiles = createStore<WorkspaceFileShortDataT[]>([])
    .on(setWpFiles, (_, newState) => newState)
    .reset(resetAllStates)

// WORKSPACE COMMON GROUP FILES
export const setCommonGroupDocuments = createEvent<[Array<WorkspaceDirectoryShortDataT>, Array<WorkspaceFileShortDataT>]>()
export const pushToCommonGroupDocuments = createEvent<[WorkspaceDirectoryShortDataT | null, WorkspaceFileShortDataT | null]>()

export const $CommonGroupDocuments = createStore<[Array<WorkspaceDirectoryShortDataT>, Array<WorkspaceFileShortDataT>]>([[], []])
    .on(setCommonGroupDocuments, (_, newState) => newState)
    .on(pushToCommonGroupDocuments, (oldState, newState) => {
        if (newState[0]) {
            oldState[0].unshift(newState[0])
        }
        if (newState[1]) {
            oldState[1].unshift(newState[1])
        }
        return oldState
    })
    .reset(resetAllStates)

// WORKSPACE EVENT STATES
export const setWpDocumentsLoading = createEvent<boolean>()
export const setWpDocumentsError = createEvent<boolean>()
export const setWpDocumentsFetched = createEvent<boolean>()

export const $WpDocumentsStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setWpDocumentsLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setWpDocumentsError, (oldState, newState) => ({ ...oldState, isLoading: false, error: newState }))
    .on(setWpDocumentsFetched, (oldState, newState) => ({ ...oldState, isFetched: newState }))
    .reset(resetAllStates)

// REQUESTS
export const fetchWorkspaceCommonData = createEffect(async () => {
    setWpDocumentsLoading(true)

    WorkspaceService.GetWorkspace(0, 0, (err, res) => {
        if (err || !res) {
            setWpDocumentsError(true)
            return console.log('При получении данных рабочего блока произошла ошибка')
        }
        setWpDirectories(res.data.directories)
        setWpFiles(res.data.files)
        setCommonGroupDocuments([res.data.directories, res.data.files])
        setWpDocumentsLoading(false)
        setWpDocumentsFetched(true)
    })
})
