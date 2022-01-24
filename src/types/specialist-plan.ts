export type PlanTaskDataT = {
    id: number
    title: string
    desc: string
    status: number
    periodicity: number
    savedToCalendar: number
    groupId: number
    parentId: number
    startDate: number
    deadline: number
}

export type TaskChangeHistoryT = {
    id: number
    updatedAt: number
    oldDeadLine: number
    newDeadLine: number
}

export type SimplePlanGroupDataT = {
    id: number
    title: string
}

export type PlanGroupDataT = SimplePlanGroupDataT & {
    tasks: PlanTaskDataT[]
}

export type PlanGroupsStoreT = {
    count: number
    rows: PlanGroupDataT[]
}

export type SelectedTasksStateT = {
    [key: string]: {
        display: boolean
        subtasks: {
            [key: string]: boolean
        }
    }
}