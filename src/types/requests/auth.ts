import { UserDataT } from '@interfaces/user'
import { CompanyT } from '@interfaces/company/company'

// CHECK AUTH
export type CheckAuthResT = {
    user: UserDataT
}

// LOGIN
export type LoginResT = CheckAuthResT & {
    accessToken: string
}

export type ServiceLoginPropsT = {
    email: string
    password: string
}

// SIGNUP
export type SignupResT = {
    message: string
}

export type ServiceSignupPropsT = {
    email: string
    name: string
    password: string
    passwordConfirm: string
}

// UPDATING USER DATA
export type UpdateUserDataPropsT = {
    email: string | null
    name: string
    phone: string
}

// UPDATING PASSWORD
export type UpdatePasswordPropsT = {
    oldPassword: string
    password: string
    passwordConfirm: string
}

// ADDING NEW SUPER ADMIN
export type AddNewSuperAdminPropsT = {
    name: string
    email: string
    password: string
}