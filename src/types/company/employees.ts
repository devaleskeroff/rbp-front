import { FileShortDataT, PositionShortDataT } from '@interfaces/company/units'

export type EmployeeListDataT = {
    id: number
    name: string
    email: string
    phone: string
    units: {
        id: number
        title: string
    }[]
    positions: {
        id: number
        title: string
    }[]
}

export type EmployeeDocumentT = {
    id: number
    status: number
    signedAt: number
    signatureEnd: number
    position: { title: string }
    file: {
        id: number
        title: string
        path: string
        hash: string
    }
}

export type RelatedEmployeeDataT = EmployeeListDataT & {
    signed_documents: EmployeeDocumentT[]
}

// ADDING NEW EMPLOYEE MODAL TYPES
export type PositionForSelectDataT = PositionShortDataT & {
    value: number
    label: string
    unitId: number
    unitTitle: string
}

export type PositionGroupT = {
    label: string
    unitId: number
    options: PositionForSelectDataT[]
}

export type SimpleOptionT = {
    value: number
    label: string
}

export type SelectedPositionsT = {
    unitId: number
    positions: number[]
}

export type EmployeeTablePropsT = {
    unitId?: number
    items?: EmployeeListDataT[] | null
    setItems?: (data: EmployeeListDataT[]) => void
}

export type EmployeeSignaturesTablePropsT = {
    employeeId: number
    items: EmployeeDocumentT[] | undefined
}

// FETCHING EMPLOYEE DATA & DOCUMENTS FOR SIGNING
export type SigningDocumentT = {
    id: number
    viewed: number
    file: FileShortDataT
}

export type EmployeeDataForSigningT = {
    id: number
    name: string
    email: string
    company: {
        image: string
    }
    signingDocuments: SigningDocumentT[]
}
















// SINGLE EMPLOYEE ITEM TYPE

export type SingleEmployeeT = {
    id: number
    name: string
    unit: string
    position: string
    phone: string
    email: string
    role: 1 /* СПЕЦИАЛИСТ ОТ */ | 2 /* СОТРУДНИК */
}

// EMPLOYEE SIGNATURE ITEM TYPE

export type EmployeeSignaturesItemT = {
    id: number
    title: string
    signature_date: string
    signature_end: string
    status: 1 | 2 | 3 | 4 /* ВРЕМЕННАЯ ЗАГЛУШКА */
    url: string
}
