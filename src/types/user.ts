// USER TYPES
import { CompanyShortDataT, CompanyT } from '@interfaces/company/company'

export type UserDataT = {
    id: number
    name: string
    email: string
    avatar: string
    role: number
    roleName: string
    phone: string
    createdAt: string
    updatedAt: string
    selectedCompany: number
    premium: number | null,
    companies: CompanyShortDataT[]
    company: CompanyT
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
