import { EmployeeListDataT } from '@interfaces/company/employees'

export type DocumentArchiveTablePropsT = {
    setWithHistory: (val: boolean) => void
    sortOptionValue: 0 | 10 | 20
}

// DIRECTORIES
export type ArchiveFileT = {
    readonly id: number
    title: string
    updatedAt: string
}

export type ArchiveDirectoryDataT = {
    readonly id: number
    title: string
    updatedAt: string
}

// EMPLOYEES
export type ArchiveEmployeeDataT = EmployeeListDataT











export type EmployeeArchiveItemT = {
    id: number
    name: string
    unit: string
    position: string
    role: 1 /* СПЕЦИАЛИСТ ОТ */ | 2 /* СОТРУДНИК */
}
