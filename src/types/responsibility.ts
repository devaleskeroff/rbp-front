
export type ResponsibilityFileT = {
    id: number
    title: string
    hash: string
    updatedAt: string
}

export type ResponsibilityDirectoryT = {
    id: number
    title: string
    updatedAt: string
}

export type CommonResponsibilityDocsStoreT = [ResponsibilityFileT[], ResponsibilityDirectoryT[]]

export type ResponsibilityTablePropsT = {
    setWithHistory: (val: boolean) => void
    sort: number
}
