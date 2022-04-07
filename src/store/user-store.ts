import { createEvent, createStore } from 'effector'
// TYPES
import { UserDataT } from '@interfaces/user'
import { EventStateStoreT, Modules, UserAdditionalPermissions } from '@interfaces/common'
import { Permissions } from '@utils/api-tools'

// GLOBAL EVENT
export const resetAllStates = createEvent('Resetting all stores(needed when user logs out or changes company)')

// USER DATA
export const setUserData = createEvent<UserDataT | false>()
export const setSelectedCompanyId = createEvent<{ companyId: number, ownerId: number }>()
export const resetUserData = createEvent()

export const $User = createStore<UserDataT | null | false>(null)
    .on(setUserData, (state, newData) => {
        if (typeof newData === 'object') {
            if (newData.company.ownerId === newData.id &&
                (newData.role === UserRoleEnum.Specialist || newData.role === UserRoleEnum.Client)
            ) {
                newData.role = UserRoleEnum.Admin
            }
            newData.roleName = GetUserRoleName(newData.role)
            setTimeout(() => setUserRole(newData!.role))
        }
        return newData
    })
    .on(setSelectedCompanyId, (oldState, newState) => {
        if (typeof oldState === 'object') {
            oldState!.selectedCompany = newState.companyId

            if (newState.ownerId === oldState!.id &&
                (oldState!.mainRole === UserRoleEnum.Specialist || oldState!.mainRole === UserRoleEnum.Client)
            ) {
                oldState!.role = UserRoleEnum.Admin
                oldState!.roleName = GetUserRoleName(oldState!.role)
            } else {
                oldState!.role = oldState!.mainRole
                oldState!.roleName = GetUserRoleName(oldState!.role)
            }
            setUserRole(oldState!.role)
        }
        return oldState
    })
    .reset(resetUserData)

// USER ADDITIONAL PERMISSIONS
export const setUserAddPermissions = createEvent<UserAdditionalPermissions>()
export const setUserRole = createEvent<UserRoleEnum>()
export const setModule = createEvent<Modules>()

export const $UserAddPermissions = createStore<Permissions>(new Permissions())
    .on(setUserAddPermissions, (permissionsClass, permissions) => {
        return new Permissions(permissions, permissionsClass.module)
    })
    .on(setUserRole, (oldState, newRole) => {
        oldState.setRole(newRole)
        return new Permissions(oldState.permissions, oldState.module)
    })
    .on(setModule, (oldState, module) => {
        return new Permissions(oldState.permissions, oldState.module)
    })
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
