import { ResCallback } from '@interfaces/common'

export type NewsActionsT =
    | 'createNews'
    | 'createPractice'
    | 'createSpecHelp'
    | 'editNews'
    | 'editPractice'
    | 'editSpecHelp'

export type NewsType =
    | 'NEWS'
    | 'PRACTICE'
    | 'SPEC_HELP'

export type NewsT = {
    id: number
    title: string
    text: string
    tags: string
    images: string
    createdAt: number
}

// REQUESTS
export type FetchingNewsPropsT = (
    params: {
        skip: number
        limit: number
        count?: boolean
        cb?: ResCallback<{ count?: number, rows: NewsT[] }>
    }
) => void