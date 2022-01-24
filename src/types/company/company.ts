import { WorkspaceGroupT } from '@interfaces/company/workspace'

export type CompanyT = AvailableCompanyDataT & {
   readonly ownerId: number
   specialists: CompanyClientT[]
   clients: CompanyClientT[]
   groups: WorkspaceGroupT[]
}

export type CompanyShortDataT = {
   readonly id: number
   name: string
   image: string
   legalEntity: string
   inn: string
}

export type AvailableCompanyDataT = {
   readonly id: number
   name: string
   physicalAddress: string
   legalAddress: string
   shortDesc: string
   image: string
   legalEntity: string
   inn: string
}










export type CompanyTabPropsT = {
   setWithHistory: (display: boolean) => void
}

type CompanyClientT = {
   readonly id: number
   name: string
}

// export type CompanyT = {
//    readonly id: number
//    name: string
//    ownerId: number
//    physicalAddress: string
//    legalAddress: string
//    shortDesc: string
//    image: string
//    legalEntity: string
//    inn: string
//    specialists: CompanyClientT[]
//    client: CompanyClientT
// }

export type FetchingCompanyDataT = {
   success: boolean
   data: CompanyT
}



