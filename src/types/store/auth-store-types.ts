import { ServiceLoginPropsT, ServiceSignupPropsT } from '@interfaces/requests/auth'

export type AuthStoreLoginPropsT = ServiceLoginPropsT & {
    cb: (err: any) => void
}

export type AuthStoreSignupPropsT = ServiceSignupPropsT & {
    cb: (err: any) => void
}