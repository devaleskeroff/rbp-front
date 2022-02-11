import { createEvent, createStore } from 'effector'
// TYPES
import {
    CommonResponsibilityDocsStoreT,
    ResponsibilityDirectoryT,
    ResponsibilityFileT
} from '@interfaces/responsibility'
import { EventStateStoreT } from '@interfaces/common'

// LegalInformation COMMON DOCUMENTS (INITIAL PAGE)
export const setLegalInformationCommonDocs = createEvent<CommonResponsibilityDocsStoreT>()
export const pushToLegalInformationCommonDocs = createEvent<[ResponsibilityFileT | null, ResponsibilityDirectoryT | null]>()

export const $CommonLegalInformationDocuments = createStore<CommonResponsibilityDocsStoreT>([[], []])
    .on(setLegalInformationCommonDocs, (_, newState) => newState)
    .on(pushToLegalInformationCommonDocs, (oldState, newState) => {
        if (newState[0]) {
            oldState[0].push(newState[0])
        }
        if (newState[1]) {
            oldState[1].push(newState[1])
        }
        return oldState
    })

// LegalInformation DOCUMENTS
export const setLegalInformationDocuments = createEvent<CommonResponsibilityDocsStoreT>()
export const pushToLegalInformationDocs = createEvent<[ResponsibilityFileT | null, ResponsibilityDirectoryT | null]>()

export const $LegalInformationDocuments = createStore<CommonResponsibilityDocsStoreT>([[], []])
    .on(setLegalInformationDocuments, (_, newState) => newState)
    .on(pushToLegalInformationDocs, (oldState, newState) => {
        if (newState[0]) {
            oldState[0].push(newState[0])
        }
        if (newState[1]) {
            oldState[1].push(newState[1])
        }
        return oldState
    })

// COMMON DOCUMENTS STATES
export const setLegalInformationStates = createEvent<EventStateStoreT>()
export const setLegalInformationLoading = createEvent<boolean>()
export const setLegalInformationError = createEvent<boolean>()

export const $LegalInformationStates = createStore<EventStateStoreT>({ isFetched: false, isLoading: true, error: false })
    .on(setLegalInformationStates, (_, newState) => newState)
    .on(setLegalInformationLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setLegalInformationError, (oldState, newState) => ({ ...oldState, error: newState }))