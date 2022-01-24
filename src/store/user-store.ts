import { createEvent, createStore } from 'effector'
// TYPES
import { UserDataT } from '@interfaces/user'
import { EventStateStoreT } from '@interfaces/common'

// GLOBAL EVENT
export const resetAllStates = createEvent('Resetting all stores(needed when user logs out or changes company)')

// USER DATA
export const setUserData = createEvent<UserDataT | false>()
export const setSelectedCompanyId = createEvent<number>()
export const resetUserData = createEvent()

export const $User = createStore<UserDataT | null | false>(null)
    .on(setUserData, (state, newData) => {
        if (typeof newData === 'object') {
            newData.roleName = GetUserRoleName(newData.role)
        }
        return newData
    })
    .on(setSelectedCompanyId, (oldState, newState) => {
        if (typeof oldState === 'object') {
            (oldState as UserDataT).selectedCompany = newState
        }
        return oldState
    })
    .reset(resetUserData)

// USER ROLE
export const setUserRole = createEvent<UserRoleEnum>()

export const $UserRole = createStore<UserRoleEnum | null>(null)
    .on(setUserRole, (_, newState) => newState)
    .reset(resetUserData)

// USER DATA STATES
export const setUserLoading = createEvent<boolean>()
export const setUserError = createEvent<boolean>()
export const serUserStates = createEvent<EventStateStoreT>()

export const $UserDataStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setUserLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setUserError, (oldState, newState) => ({ ...oldState, isLoading: false, error: newState }))
    .on(serUserStates, (_, newState) => newState)
    .reset(resetUserData)

// UTILS
export enum UserRoleEnum {
    SuperAdmin = 777,
    Admin = 1,
    Specialist = 2,
    Client = 3
}

const GetUserRoleName = (roleId: number) => {
    switch (roleId) {
        case UserRoleEnum.SuperAdmin: return 'Суперадмин'
        case UserRoleEnum.Admin: return 'Администратор'
        case UserRoleEnum.Specialist: return 'Специалист ОТ'
        case UserRoleEnum.Client: return 'Генеральный директор'
        default: return 'Клиент'
    }
}