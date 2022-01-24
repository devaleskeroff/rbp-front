export type QAItemT = {
   title: string
   description: string
}

export type FetchingQADataT = {
   success: boolean
   data: QAItemT[]
}