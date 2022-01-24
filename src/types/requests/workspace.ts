// GET WORKSPACE DATA
import {
    WorkspaceDirectoryShortDataT,
    WorkspaceFileShortDataT,
} from '@interfaces/company/workspace'

export type GetWorkspaceResDataT = {
    id: number
    title: string
    directories: WorkspaceDirectoryShortDataT[]
    files: (WorkspaceFileShortDataT & { extension: string })[]
}

export type CreateWorkspaceDirectoryDataT = {
    groupId: number
    parentId: number | null
    title: string
}

export type UpdateFileDataT = {
    title: string
    periodicity: number
}