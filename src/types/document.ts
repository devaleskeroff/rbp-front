export type DocumentDataT = {
    success: boolean
    document: DocumentT
    units: UnitsT[] // Подразделения компании
    works: WorksT[] // Должности компании
    groups: GroupsT[] // Группы
}

export type DocumentT = {
    id: number
    name: string
    created_at: string
    groups: number[] // Массив ID для групп
    works: number[] // Массив ID должностей
    units: number[] // Массив ID подразделений
    periodicity: number
    signature: SignatureT[] //Журнал подписей
}

// periodicity это индекс периодичности в доке
//
// 1001 - Разово
// 1002 - Квартал
// 1003 - Раз в месяц
// 1004 - Полгода
// 1005 - Год

export type SignatureT = {
    id: number // ID подписи
    date_signature: string // Дата подписи
    status: 'no_signature' | 'no_verified' | 'verified' | 'expired'  // Статус
    employee: {
        id: number
        name: string
    }
}

// no_signature - без подписи
// no_verified - ожидает подписания
// verified - подписано
// expired - просрочено

type UnitsT = {
    id: number
    name: string
}

type WorksT = {
    id: number
    name: string
}

type GroupsT = {
    id: number
    name: string
}

export type PutDocumentCheckboxPropsT = {
    checked: boolean
    type: 'group' | 'unit'
    id: number
}