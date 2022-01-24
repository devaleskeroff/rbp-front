import { CompanyT } from '@interfaces/company/company'

export type CompanyFullCreatingUpdatingDataT = {
    name: string
    image: File
    physicalAddress: string
    legalAddress: string
    shortDesc: string
    legalEntity: string
    inn: string
}

// CREATE COMPANY
export type CreateCompanyPropsT = CompanyFullCreatingUpdatingDataT

export type CreateCompanyResT = CompanyT

// UPDATE COMPANY
export type UpdateCompanyResT = {
    imagePath: string
}

// CHANGE SELECTED COMPANY
export type SwitchCompanyResT = (
    params: { id: number }
) => void