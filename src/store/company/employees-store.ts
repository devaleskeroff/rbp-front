import { createEffect, createEvent, createStore } from 'effector'
// SERVICE
import EmployeeService from '@services/employee-service'
// STORE
import { resetAllStates } from '@store/user-store'
// TYPES
import { EmployeeListDataT } from '@interfaces/company/employees'
import { EventStateStoreT } from '@interfaces/common'

// EMPLOYEES DATA
export const setEmployees = createEvent<EmployeeListDataT[]>()
export const pushToEmployees = createEvent<EmployeeListDataT>()

export const $Employees = createStore<EmployeeListDataT[]>([])
    .on(setEmployees, (_, newState) => newState)
    .on(pushToEmployees, (oldState, newState) => [...oldState, newState])
    .reset(resetAllStates)

// EMPLOYEES DATA STATES
export const setEmployeesLoading = createEvent<boolean>()
export const setEmployeesFetched = createEvent<boolean>()
export const setEmployeesError = createEvent<boolean>()
export const setEmployeesStates = createEvent<EventStateStoreT>()

export const $EmployeesStates = createStore<EventStateStoreT>({ isLoading: true, isFetched: false, error: false })
    .on(setEmployeesLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setEmployeesFetched, (oldState, newState) => ({ ...oldState, isFetched: newState }))
    .on(setEmployeesError, (oldState, newState) => ({ ...oldState, isLoading: false, error: newState }))
    .on(setEmployeesStates, (_, newState) => newState)
    .reset(resetAllStates)

export const fetchEmployees = createEffect(() => {
    setEmployeesLoading(true)

    EmployeeService.GetEmployees((err, res) => {
        if (err || !res) {
            return setEmployeesError(true)
        }
        setEmployees(res.data)
        setEmployeesStates({
            isLoading: false,
            error: false,
            isFetched: true
        })
    })
})
