import { AxiosResponse, AxiosError } from 'axios'
import { JsxElement } from 'typescript'

export type ResCallback<T> = (err: AxiosError | null, res?: AxiosResponse<T>) => void

export type EventStateStoreT = {
   isFetched: boolean
   isLoading: boolean
   error: boolean,
}

export type UnparsedBannersAndSlidesT = {
   banners: string
   slides: string
}

export type ParsedBannersAndSlidesT = {
   banners: string[]
   slides: string[]
}














export interface ApiData {
   success: boolean
   data: Array<{ [key: string]: any }> | { [key: string]: any }
   count: number
   limit: number
}

export type ItemsOfStringArrayT = {
   items: string[]
}

export type HeaderPropsT = {
   menuDisplay: boolean
   onBurgerClick: () => void
   resetActiveNav: (url: string) => void
   unauthorized?: boolean
}

export type MenuBurgerIconsPropsT = {
   menuDisplay: boolean
   onBurgerClick: () => void
}

export type MenuPanelPropsT = {
   active: string
   onItemClick: (link: string) => void
}

export type MenuItemT = {
   text: string
   imageSrc: string
   link: string
   notification?: boolean
}

export type MenuItemsPropsType = {
   items: MenuItemT[]
   url: string
   onItemClick: (link: string) => void
}

export type PageTabPropsT = {
   label: string
   path: string
   exact?: boolean
}

export interface TabItemsPropsT {
   items: PageTabPropsT[]
}

export type TableTopPanelPropsT = {
   text: string
   options?: SortOptionT[]
   onSearch?: (value: string) => void
   onSelectOption?: (option: SortOptionT) => void
   hideSearchPanel?: boolean
   hideSelectPanel?: boolean
   withoutPadding?: boolean
}

export type SortOptionT = {
   label: string
   value: number
}

// COMMON COMPONENTS

export type ColorfulActionButtonPropsT = {
   link?: string
   text: string
   plusIcon?: boolean
   customIcon?: any
   type?: 'button' | 'submit' | 'reset'
   onClick?: () => void
}

export type TitlePropsT = {
   text: string
   withHistory?: boolean
}

export type FileForViewButtonT = {
   id: number
   title: string
   hash: string
   extension: string
   path: string
}