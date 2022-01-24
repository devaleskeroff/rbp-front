import { ApiData, ResCallback } from '@interfaces/common'

export type CourseT = {
    id: number
    type: 'COURSE' | 'WEBINAR'
    title: string
    desc: string
    image: string
    tags: string
    teachers: string
    link: string
    dateStart: number
}

export type CourseStoreT = {
    coursesCount: number
    webinarsCount: number
    courses: CourseT[]
}

export type FetchingCoursePropsT = (
    params: {
        type?: 'COURSE' | 'WEBINAR'
        offset: number
        limit: number
        count?: boolean
        cb?: ResCallback<CourseStoreT>
    }
) => void

export type CourseTagsPropsT = {
    items: string[]
    selectedTag: string | null
    onClick: (e: any) => void
}

export type CourseCategoriesPropsT = {
    items: {
        value: string
        label: string
    }[]
    onClick: (e: any) => void
}