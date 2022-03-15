import { createEffect, createEvent, createStore } from 'effector'
// STORE
import {
    serUserStates,
    setUserData,
    setUserError,
    setUserLoading,
    setUserAddPermissions
} from '@store/user-store'
import { setWpGroups } from '@store/company/workspace-store'
import { setCompany } from '@store/company/company-store'
// SERVICES
import AuthService from '@services/auth-service'
// TYPES
import { AuthStoreLoginPropsT, AuthStoreSignupPropsT } from '@interfaces/store/auth-store-types'

// AUTH STORE
export const setAuth = createEvent<boolean>()

export const $Auth = createStore<boolean | null>(null) /* MUST BE NULL FOR INITIAL STATE */
    .on(setAuth, (_, newState) => newState)


// REQUESTS
export const checkAuth = createEffect(async () => {
    setUserLoading(true)

    await AuthService.CheckAuth((err, res) => {
        if (err || !res) {
            setUserError(true)
            return setAuth(false)
        }
        res.data.user.avatar = res.data.user.avatar || '/static/images/dummy-avatar.png'
        res.data.user.company.image = res.data.user.company.image || '/static/images/dummy-logo.png'
        res.data.user.companies = res.data.user.companies.map(company => {
            if (!company.image) {
                company.image = '/static/images/dummy-logo.png'
            }
            return company
        })

        setUserData(res.data.user)
        setUserAddPermissions({
            id: res.data.user.id,
            role: res.data.user.role,
            modules: res.data.user.additionalPermissions
        })
        setCompany(res.data.user.company)
        setWpGroups(res.data.user.company.groups)

        serUserStates({ error: false, isLoading: false, isFetched: true })
        setAuth(true)
    })
})

export const login = createEffect<AuthStoreLoginPropsT, void>(async (data) => {
    const { cb } = data
    setUserLoading(true)

    await AuthService.Login(
        { email: data.email, password: data.password },
        (err, res) => {
            if (err || res?.status !== 200) {
                cb(err)
                setUserError(true)
                return setAuth(false)
            }
            localStorage.setItem('token', res.data.accessToken)

            res.data.user.avatar = res.data.user.avatar || '/static/images/dummy-avatar.png'
            res.data.user.company.image = res.data.user.company.image || '/static/images/dummy-logo.png'
            res.data.user.companies = res.data.user.companies.map(company => {
                if (!company.image) {
                    company.image = '/static/images/dummy-logo.png'
                }
                return company
            })

            setUserData(res.data.user)
            setUserAddPermissions({
                id: res.data.user.id,
                role: res.data.user.role,
                modules: res.data.user.additionalPermissions
            })
            setCompany(res.data.user.company)
            setWpGroups(res.data.user.company.groups)

            serUserStates({ error: false, isLoading: false, isFetched: true })
            setAuth(true)
            cb(null)
        })
})

export const signup = createEffect<AuthStoreSignupPropsT, void>(async (data) => {
    const { cb } = data

    await AuthService.Signup(
        {
            email: data.email,
            name: data.name,
            password: data.password,
            passwordConfirm: data.passwordConfirm
        },
        (err, res) => {
            if (err || res?.status !== 200) {
                cb(err)
                return setAuth(false)
            }
            cb(null)
        })
})
