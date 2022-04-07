// USER TYPES
import { CompanyShortDataT, CompanyT } from '@interfaces/company/company'
import { UserAdditionalPermissions } from '@interfaces/common'

export type UserDataT = {
    id: number
    name: string
    email: string
    avatar: string
    role: number
    mainRole: number
    roleName: string
    phone: string
    createdAt: string
    updatedAt: string
    selectedCompany: number
    premium: number | null,
    companies: CompanyShortDataT[]
    company: CompanyT
    additionalPermissions: UserAdditionalPermissions['modules']
}

export type WorkerShortDataT = {
    id: number
    name: string,
    email: string
    role: number
    companies: {
        id: number
        name: string
        createdAt: string
    }[]
}
