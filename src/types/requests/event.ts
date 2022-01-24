
export type CreateEventPropsT = {
    title: string
    desc: string
    dateStart: number
    dateFinish: number
}

export type SendByEmailPropsT = {
    emailType: 1 /* SIMPLE EVENT */ | 2 /* SIGNING EVENT */
    title?: string
    desc?: string
    employee?: string
    document?: string
    position?: string
    dateStart: string
    dateFinish: string
}

export type GetEventsPropsT = {
    dateStart: number | null
    dateFinish: number | null
    type?: 'EVENT' | 'SIGNATURE'
    skip?: number
    limit?: number
    count?: boolean
}