import { NewsT } from '@interfaces/news'

export type GetNewsOrPracticesPropsT = {
    type: 'PRACTICE' | 'NEWS' | 'SPEC_HELP'
    skip: number
    limit: number
    count?: boolean
}

export type GetNewsOrPracticesResT = {
    count?: number
    rows: NewsT[]
}