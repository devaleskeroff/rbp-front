import { EventT } from '@interfaces/company/event'

export type HomeStoreT = {
    notifications: EventT[] | null | false
    isFetched: boolean
    banners: null | string[]
    slides: null | string[]
}