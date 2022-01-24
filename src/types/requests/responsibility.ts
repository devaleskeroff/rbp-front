import { ResponsibilityDirectoryT, ResponsibilityFileT } from '@interfaces/responsibility'

export type GetResponsibilityDocumentsResT = {
    files: ResponsibilityFileT[]
    directories: ResponsibilityDirectoryT[]
}

export type CreateResponsibilityDirectoryPropsT = {
    title: string
    parentId: number | null
}