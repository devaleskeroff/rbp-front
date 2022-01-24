export type AddNewEmployeePropsT = {
    name: string
    email: string
    phone: string
    units: number[]
    positions: number[]
}

export type SignDocumentsPropsT = {
    companyId: number
    employeeId: number
    verifyingId: string
    code: string
}