import { createEffect, createEvent, createStore } from 'effector'
// SERVICE
import SpecialistPlanService from '@services/specialist-plan-service'
// STORE
import { resetAllStates } from '@store/user-store'
// TYPES
import { PlanGroupDataT, PlanGroupsStoreT, PlanTaskDataT, SimplePlanGroupDataT } from '@interfaces/specialist-plan'
import { EventStateStoreT } from '@interfaces/common'
import { FetchingPlansPropsT } from '@interfaces/requests/specialist-plan'

// PLANS DATA
export const setPlans = createEvent<PlanGroupsStoreT>()
export const pushToPlans = createEvent<PlanGroupDataT[]>()
export const pushToTasks = createEvent<PlanTaskDataT>()
export const updatePlanGroup = createEvent<SimplePlanGroupDataT>()
export const updatePlanTask = createEvent<PlanTaskDataT>()
export const removeGroup = createEvent<number>()
export const removeTask = createEvent<number>()

export const $SpecialistPlans = createStore<PlanGroupsStoreT>({ count: 0, rows: [] })
    .on(setPlans, (_, newState) => newState)
    .on(pushToPlans, (oldState, newState) => ({
        count: oldState.count,
        rows: [...oldState.rows, ...newState]
    }))
    .on(pushToTasks, (oldState, newTask) => {
        const renewingGroupIdx = oldState.rows.findIndex(group => group.id === newTask.groupId)
        oldState.rows[renewingGroupIdx]?.tasks.push(newTask)

        return { ...oldState }
    })
    .on(updatePlanGroup, (oldState, updatedGroup) => {
        const renewingGroupIdx = oldState.rows.findIndex(group => group.id === updatedGroup.id)
        oldState.rows[renewingGroupIdx].title = updatedGroup.title

        return { ...oldState }
    })
    .on(updatePlanTask, (oldState, updatedTask) => {
        return {
            count: oldState.count,
            rows: oldState.rows.map(group => {
                const taskIndex = group.tasks.findIndex(task => task.id === updatedTask.id)
                if (taskIndex !== -1) {
                    group.tasks[taskIndex] = {
                        ...updatedTask,
                        groupId: group.tasks[taskIndex].groupId,
                        parentId: group.tasks[taskIndex].parentId
                    }
                }
                return group
            })
        }
    })
    .on(removeGroup, (oldState, groupId) => ({
        count: oldState.count - 1,
        rows: oldState.rows.filter(group => group.id !== groupId)
    }))
    .on(removeTask, (oldState, taskId) => ({
        count: oldState.count,
        rows: oldState.rows.map(group => {
            const isInThisGroup = group.tasks.find(task => task.id === taskId || task.parentId === taskId)
            if (isInThisGroup) {
                group.tasks = group.tasks.filter(task => task.id !== taskId && task.parentId !== taskId)
            }
            return group
        })
    }))
    .reset(resetAllStates)

// PLANS STATES
export const setPlansLoading = createEvent<boolean>()
export const setPlansError = createEvent<boolean>()
export const setPlansStates = createEvent<EventStateStoreT>()

export const $SpecialistPlansStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setPlansLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setPlansError, (oldState, newState) => ({ ...oldState, isLoading: false, error: newState }))
    .on(setPlansStates, (_, newState) => newState)
    .reset(resetAllStates)

// REQUESTS
export const fetchSpecialistPlans = createEffect<FetchingPlansPropsT>(({ companyId, offset, limit, count, cb }) => {
    SpecialistPlanService.GetSpecialistPlans(companyId, offset, limit, count || false, (err, res) => {
        if (err || !res) {
            setPlansStates({ isFetched: true, error: true, isLoading: false })
            if (cb) cb(err)
            return
        }
        if (count) {
            setPlans(res.data as PlanGroupsStoreT)
        } else {
            pushToPlans(res.data as PlanGroupDataT[])
        }
        setPlansStates({ isFetched: true, error: false, isLoading: false })
        if (cb) cb(null, res)
    })
})