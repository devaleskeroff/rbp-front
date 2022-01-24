import { createEffect, createEvent, createStore } from 'effector'
// SERVICE
import UnitService from '@services/unit-service'
// STORE
import { $Employees, setEmployees, setEmployeesFetched } from '@store/company/employees-store'
import { resetAllStates } from '@store/user-store'
// TYPES
import { UnitShortDataT } from '@interfaces/company/units'
import { EventStateStoreT } from '@interfaces/common'
import {
    CreateNewPositionPropsT,
    CreateNewUnitPropsT,
    UpdatePositionPropsT,
    UpdateUnitPropsT
} from '@interfaces/store/units-store-types'

// UNITS DATA
export const setUnits = createEvent<UnitShortDataT[]>()

export const $Units = createStore<UnitShortDataT[]>([])
    .on(setUnits, (_, newState) => newState)
    .reset(resetAllStates)

// UNITS STATES
export const setUnitStateLoading = createEvent<boolean>()
export const setUnitStateError = createEvent<boolean>()
const setUnitStateFetched = createEvent<boolean>()
const setUnitStates = createEvent<EventStateStoreT>()

export const $UnitState = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setUnitStateLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))
    .on(setUnitStateError, (oldState, newState) => ({ ...oldState, isLoading: false, error: true }))
    .on(setUnitStateFetched, (oldState, newState) => ({ ...oldState, isFetched: newState }))
    .on(setUnitStates, (_, newState) => newState)
    .reset(resetAllStates)

export const fetchUnits = createEffect(async () => {
    UnitService.GetAllUnits((err, res) => {
        if (err || !res) {
            return setUnitStateError(true)
        }
        setUnits(res.data)
        setUnitStates({
            isLoading: false,
            error: false,
            isFetched: true
        })
    })
})

export const createNewUnit = createEffect<CreateNewUnitPropsT>(async ({ title, cb }) => {
    UnitService.CreateNewUnit(title, (err, res) => {
        if (err || !res) {
            return cb(err)
        }
        setUnits([ ...$Units.getState(), res.data ])
        cb(null)
    })
})

export const updateUnit = createEffect<UpdateUnitPropsT>(async ({ unitId, title, cb }) => {
    UnitService.UpdateUnit(unitId, title, (err, res) => {
        if (err || !res) {
            return cb(err)
        }
        setUnits($Units.getState().map(unit => {
            if (unit.id === unitId) {
                unit.title = title
            }
            return unit
        }))
        cb(null)
    })
})

export const removeUnit = createEffect<(p: { id: number }) => void>(async ({ id }) => {
    UnitService.RemoveUnit(id, (err, res) => {
        if (err || !res) {
            return console.log('При удалении подразделения произошла ошибка')
        }
        const units = $Units.getState()
        const unitIndex = units.findIndex(unit => unit.id === id)

        if (units[unitIndex].employeesCount > 0) {
            // ITS DOING TO RE-FETCH EMPLOYEES DATA WHEN USER WILL VISIT EMPLOYEES PAGE
            // ( DO THIS IF EMPLOYEES COUNT GREATER THAN 0)
            setEmployeesFetched(false)
        }
        units.splice(unitIndex, 1)
        setUnits(Array.from(units))
    })
})

export const createNewPosition = createEffect<CreateNewPositionPropsT>(async ({ unitId, title, cb }) => {
    UnitService.CreateNewPosition(unitId, title, (err, res) => {
        if (err || !res) {
            return cb(err)
        }
        setUnits($Units.getState().map(unit => {
            if (unit.id === unitId) {
                unit.positions.push(res.data)
            }
            return unit
        }))
        cb(null, res)
    })
})

export const updatePosition = createEffect<UpdatePositionPropsT>(async ({ positionId, unitId, title, cb }) => {
    UnitService.UpdatePosition(positionId, title, (err, res) => {
        if (err || !res) {
            return cb(err)
        }
        setUnits($Units.getState().map(unit => {
            if (unit.id === unitId) {
                unit.positions = unit.positions.map(position => {
                    if (position.id === positionId) {
                        position.title = title
                    }
                    return position
                })
            }
            return unit
        }))
        setEmployees($Employees.getState().map(employee => {
            const employeePositionIndex = employee.positions.findIndex(employeePos => employeePos.id === positionId)
            if (employeePositionIndex >= 0) {
                employee.positions[employeePositionIndex].title = title
            }
            return employee
        }))
        cb(null, res)
    })
})
