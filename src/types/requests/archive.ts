import { ArchiveDirectoryDataT, ArchiveEmployeeDataT, ArchiveFileT } from '@interfaces/company/archive'

export type ArchiveCompanyDataT = {
    id: number
    name: string
    directories: ArchiveDirectoryDataT[]
    files: ArchiveFileT[]
}

// FETCHING ARCHIVE DOCUMENTS
export type GetArchiveDocumentsResT = ArchiveCompanyDataT

// FETCHING ARCHIVE EMPLOYEES
export type GetArchiveEmployeesResT = ArchiveEmployeeDataT[]

// MOVING ARCHIVED DIRECTORY TO WORKSPACE
export type UnarchiveDirectoryResDataT = {
    groupId: number | null
}