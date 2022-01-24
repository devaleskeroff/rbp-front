export enum SignatureStatusEnum {
    signed = 1,
    waitingForSignature,
    expired
}

export type PositionShortDataT = {
    id: number
    title: string
}

export type UnitShortDataT = {
    id: number
    title: string
    employeesCount: number
    positions: PositionShortDataT[]
}

export type UnitFileDataT = {
    id: number
    title: string
}

export type GetFilesForAddingToUnitPropsT = {
    unitId: number
    groupId: number
    addedFilesIds?: number[] | null
    minify?: string
}

export type GetFilesForAddingToPositionPropsT = {
    unitId: number
    positionId: number
    addedFilesIds?: number[] | null
    minify?: string
}

export type UnitFileForAddingToUnitAndPositionResT = {
    files: UnitFileForAddingToPositionDataT[]
    addedFilesIds?: number[]
}

export type FileShortDataT = {
    id: number
    title: string
    path: string
    hash: string
}

export type UnitFileForAddingToPositionDataT = FileShortDataT

export type DocumentTablePropsT = {
    items: UnitFileDataT[] | null
    error: boolean
    unitId: number
}

export type SendingForSignatureDocumentT = {
    readonly id: number
    title: string
    path: string
    hash: string
}

export type DocumentSignatureHistoryT = {
    signer: {
        name: string
    }
    position: {
        title: string
    }
    signedAt: number
    signatureEnd: number
}

export type DocumentSignatureHistoryTablePropsT = {
    signatures: DocumentSignatureHistoryT[]
}













type PositionT = {
    id: number
    title: string
}

export type ShortDocumentT = {
    id: number
    title: string
    status:
        | 1 /* ИМЕЕТСЯ */
        | 2 /* ПРОСРОЧЕНА */
        | 3 /* НЕТ ПОДПИСИ */
}

export type UnitsTablePropsT = {
    setWithHistory: (val: boolean) => void
}

export type PositionsTablePropsT = {
    items: PositionT[]
    unitId: number
}