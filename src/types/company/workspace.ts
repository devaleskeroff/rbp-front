// GROUP
export type WorkspaceGroupT = {
    readonly id: number
    title: string
}

// DIRECTORIES
export type WorkspaceDirectoryT = {
    readonly id: number
    title: string
    isArchive: boolean
    groupId: number
    parentId: number
}

export type WorkspaceDirectoryShortDataT = {
    readonly id: number
    title: string
}

// FILES
export type WorkspaceFileT = {
    readonly id: number
    title: string
    isArchive: boolean
    groupId: number
    directoryId: number
    periodicity: number
    path: string
    hash: string
    extension: string
}

export type WorkspaceFileShortDataT = {
    readonly id: number
    title: string
    path: string
    hash: string
    extension: string
    periodicity?: FilePeriodicityEnum
    groupId?: number
}

export enum FilePeriodicityEnum {
    OneTime = 1001,
    Quarter = 1002,
    OnceMonth = 1003,
    HalfYear = 1004,
    OnceYear = 1005
}

export type WorkspaceTablePropsT = {
    setWithHistory: (val: boolean) => void
}