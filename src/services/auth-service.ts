import Fetcher from '@http/fetcher'
// STORE
import { setAuth } from '@store/auth-store'
import { resetAllStates, resetUserData } from '@store/user-store'
import { resetCompany } from '@store/company/company-store'
// TYPES
import { ResCallback } from '@interfaces/common'
import {
    AddNewSuperAdminPropsT,
    CheckAuthResT,
    LoginResT,
    ServiceLoginPropsT,
    ServiceSignupPropsT,
    SignupResT, UpdatePasswordPropsT, UpdateUserDataPropsT
} from '@interfaces/requests/auth'

class AuthService {

    static async CheckAuth(cb: ResCallback<CheckAuthResT>) {
        try {
            const accessToken = localStorage.getItem('token')
            if (!accessToken) {
                throw new Error('Не авторизован')
            }

            const res = await Fetcher.post<CheckAuthResT>('/auth/check')

            if (res?.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async Login(data: ServiceLoginPropsT, cb: ResCallback<LoginResT>) {
        try {
            const res = await Fetcher.post<LoginResT>('/auth/login', data)

            if (res?.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async Signup(data: ServiceSignupPropsT, cb: ResCallback<SignupResT>) {
        try {
            const res = await Fetcher.post<SignupResT>('/auth/signup', data)

            if (res?.status === 201 || res?.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async Logout(cb: ResCallback<unknown>) {
        setAuth(false)
        resetAllStates()
        resetUserData()
        resetCompany()
        try {
            const res = await Fetcher.post('/auth/logout')

            if (res?.status === 200) {
                return cb(null)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async SetAvatar(data: FormData, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.put<string>('/auth/avatar', data)

            if (res?.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateUserData(data: UpdateUserDataPropsT, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/auth/data/update`, data)

            if (res?.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async ChangePassword(data: UpdatePasswordPropsT, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/auth/password/update`, data)

            if (res?.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async AddNewSuperAdmin(data: AddNewSuperAdminPropsT, cb: ResCallback<void>) {
        try {
            const res = await Fetcher.post<void>('/auth/superadmin', data)

            if (res?.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default AuthService