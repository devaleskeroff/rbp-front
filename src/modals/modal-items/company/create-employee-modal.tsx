import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { useStore } from 'effector-react'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
// COMPONENTS
import { TextField } from '@material-ui/core'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { selectColourStyles, selectTheme } from '@components/common/common'
// SERVICE
import EmployeeService from '@services/employee-service'
// STORE
import { $Employees, pushToEmployees, setEmployees } from '@store/company/employees-store'
import { $Units, setUnits } from '@store/company/units-store'
// VALIDATOR
import Validator from '@utils/validator'
// TYPES
import {
    PositionForSelectDataT,
    SelectedPositionsT,
    PositionGroupT,
    SimpleOptionT
} from '@interfaces/company/employees'
// STYLES
import style from '@scss/modals/company/create-company.module.scss'
// INITIALIZATION
const animatedComponents = makeAnimated()

const CreateEmployeeModal = () => {
    const employees = useStore($Employees)
    // SELECT ITEMS
    const unitItems = useStore($Units)
    const [positionItems, setPositionItems] = useState<PositionForSelectDataT[][]>([])
    // SELECTED ITEMS
    const [selectedUnits, setSelectedUnits] = useState<number[]>([])
    const [selectedPositions, setSelectedPositions] = useState<SelectedPositionsT[]>([])
    // OPTIONS
    const [unitOptions, setUnitOptions] = useState<SimpleOptionT[]>([])
    const [positionOptions, setPositionOptions] = useState<PositionGroupT[]>([])
    const [selectedUnitOptions, setSelectedUnitOptions] = useState<SimpleOptionT[]>([])
    const [selectedPositionOptions, setSelectedPositionOptions] = useState<SimpleOptionT[]>([])
    // OTHER
    const [validation, setValidation] = useState<any>({})

    const { close, modalComponent, modalData } = useModal()
    const classes = useStyles()

    useEffect(() => {
        setUnitOptions(unitItems.map(unit => ({ label: unit.title, value: unit.id })))
    }, [unitItems])

    useEffect(() => {
        // ?????????????????? ????????????????????, ?????????????? ?????????? ?????????? ?????????????????????????? ?????? ???????????? ?? ???????????????????? ????????????
        // unitId ?? unitTitle ?????????????????????? ?????? ????????, ?????????? ?? ???????????????? ?????????????????? ???????????? ?????????????????????? ???????????? ??????????????????
        // unitTitle ?? ?????? ???????????? ?????????????????? ?????????? ???????????????????????? ?????????????????????????? ???? unitId ?? ?? ???????????????? ?????????????????? ????????????????????
        // ?????????????????????????? ???????????????? position.id(?? ?????????????? ?????????????????????????? ?? position.value(????. ????????), ???????????? ??????
        // ???????????????????? SELECT ?????????????? ???????????? ???????? label ?? value.
        setSelectedUnitOptions(
            unitItems
                .filter(unit => selectedUnits.find(selectedUnitId => selectedUnitId === unit.id))
                .map(unit => ({ label: unit.title, value: unit.id }))
        )

        if (selectedUnits.length === 0) {
            setPositionItems([])
            return setSelectedPositions([])
        }

        setPositionItems(
            unitItems
                .filter(unitItem => selectedUnits.find(selectedUnit => selectedUnit === unitItem.id))
                .map(unitItem => (
                    unitItem.positions.map((position, idx) => {
                        (position as PositionForSelectDataT).unitId = unitItem.id
                        if (idx === 0) {
                            (position as PositionForSelectDataT).unitTitle = unitItem.title
                        }
                        return position as PositionForSelectDataT
                    })
                ))
        )
        updatedSelectedOptions()
    }, [selectedUnits])

    useEffect(() => {
        updatedSelectedOptions()
    }, [selectedPositions])

    useEffect(() => {
        // ????. ?????????????????????? ????????, ?????? ?????????????????? ???????????? ?????????????????????????? ?????????????? ?????????? ????????
        const posOptions = positionItems.map(posGroup => {
            return {
                label: posGroup[0]?.unitTitle || '',
                unitId: posGroup[0]?.unitId || 0,
                options: posGroup.map(pos => {
                    (pos as any).value = pos.id;
                    (pos as any).label = pos.title
                    return pos as PositionForSelectDataT
                })
            }
        })
        setPositionOptions(posOptions)
    }, [positionItems])

    const updatedSelectedOptions = useCallback(() => {
        let allSelectedUnitsPosOptions: PositionForSelectDataT[] = []
        const selectedPositionsIds: number[] = []

        positionOptions
            .filter(posOptionGroup => selectedUnits.find(unitId => unitId === posOptionGroup.unitId))
            .map(posOptionGroup => posOptionGroup.options)
            .forEach(selectedPosOptions => allSelectedUnitsPosOptions.push(...selectedPosOptions))

        selectedPositions.forEach(selectedPosition => selectedPositionsIds.push(...selectedPosition.positions))

        setSelectedPositionOptions(
            allSelectedUnitsPosOptions
                .filter(selectedUnitPosOption => selectedPositionsIds.find(posId => posId === selectedUnitPosOption.id))
        )
    }, [positionOptions, selectedPositions, selectedUnits])

    const handleOptionChanging = (options: SimpleOptionT[] | PositionForSelectDataT[], type: 'unit' | 'position') => {
        if (type === 'unit') {
            return setSelectedUnits((options as SimpleOptionT[]).map(option => option.value))
        }

        const selectedPosItems: SelectedPositionsT[] = [];
        (options as PositionForSelectDataT[]).forEach(option => {
            const unitWithPositionIndex = selectedPosItems.findIndex((item: any) => item.unitId === option.unitId)
            if (!(unitWithPositionIndex < 0)) {
                selectedPosItems[unitWithPositionIndex].positions.push(option.value)
            } else {
                selectedPosItems.push({
                    unitId: option.unitId,
                    positions: [option.value]
                })
            }
        })
        setSelectedPositions(selectedPosItems)
    }

    useEffect(() => {
        if (modalData.employee) {
            const defaultSelectedPositionOptions = modalData.employee.positions.map((pos: any) => ({ ...pos, label: pos.title, value: pos.id }))
            const defaultSelectedPositions = unitItems
                .filter(unit => modalData.employee.units.find((employeeUnit: any) => employeeUnit.id === unit.id))
                .map(unit => ({
                    unitId: unit.id,
                    positions: defaultSelectedPositionOptions.map((defaultPos: any) => defaultPos.value)
                }))

            setSelectedUnitOptions(modalData.employee.units.map((unit: any) => ({ ...unit, label: unit.title, value: unit.id })))
            setSelectedUnits(modalData.employee.units.map((unit: any) => unit.id))
            setSelectedPositions(defaultSelectedPositions)

            setTimeout(() => {
                setSelectedPositionOptions(defaultSelectedPositionOptions)
            }, 100)
        }
        // CHANGING OVERFLOW Y TO VISIBLE FOR CORRECT DISPLAY OF THE MODAL
        const modalContent = document.querySelector(`.${ clsx(style.create_company_modal) }`) as HTMLDivElement
        modalContent.closest('div.react-responsive-modal-modal')?.classList?.add(clsx(style.overflowYVisible))
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        const nameField = document.querySelector('input[name="name"]') as HTMLInputElement
        const emailField = document.querySelector('input[name="email"]') as HTMLInputElement
        const phoneField = document.querySelector('input[name="phone"]') as HTMLInputElement

        if (!nameField) {
            return console.log('?????????????????? ?????????????????????? ????????????')
        }

        const positions: number[] = []
        selectedPositions.forEach(pos => positions.push(...pos.positions))

        const validating = {
            ...Validator(nameField.value, 'name').isRequired().withMessage('?????? ???????? ????????????????????????').getErrors(),
            ...Validator(emailField.value || 'dummyemail@mail.ru', 'email')
                .isEmail()
                .withMessage('???????????????????????? ?????????? ????. ??????????')
                .getErrors(),
            ...Validator(selectedUnits.length.toString(), 'unit')
                .isGreater(0)
                .withMessage('?????????????????? ???????????? ???????????????????? ?????? ?????????????? ?? 1 ??????????????????????????')
                .getErrors(),
            ...Validator(positions.length.toString(), 'position')
                .isGreater(0)
                .withMessage('???????????????????? ???????????? ???????? ?????????????????? ?????? ?????????????? 1 ??????????????????')
                .getErrors()
        }

        if (Validator.hasError(validating)) {
            modalBtn.disabled = false
            return setValidation(validating)
        }

        const newData = {
            name: nameField.value,
            email: emailField.value,
            phone: phoneField.value,
            units: selectedUnits,
            positions
        }

        // UPDATING (DONT FORGET "RETURN")
        if (modalData.employee) {
            return EmployeeService.UpdateEmployee(modalData.employee.id, newData, (err, res) => {
                if (err || !res) {
                    if (err?.response?.status === 422) {
                        setValidation(err.response.data)
                        modalBtn.disabled = false
                    }
                    return console.log('?????? ???????????????????? ???????????? ???????????????????? ?????????????????? ????????????')
                }
                // <-- DECREMENTING EMPLOYEES COUNT, IF THERE HAS BEEN REMOVED ANY UNIT
                const removedUnits = modalData.employee.units
                    .filter((oldUnit: any) => !res.data.units.find((newUnits: any) => newUnits.id === oldUnit.id))
                    .map((unit: any) => unit.id)

                if (removedUnits.length > 0) {
                    setUnits(unitItems.map(unit => {
                        if (removedUnits.find((removedUnitId: number) => removedUnitId === unit.id)) {
                            unit.employeesCount--
                        }
                        return unit
                    }))
                }
                // -->
                // <-- INCREMENTING EMPLOYEES COUNT, IF THERE HAS BEEN ADDED A NEW UNIT
                const newUnits = res.data.units
                    .filter(unit => !modalData.employee.units.find((employeeUnit: any) => employeeUnit.id === unit.id))
                    .map(unit => unit.id)

                if (newUnits.length > 0) {
                    setUnits(unitItems.map(unit => {
                        if (newUnits.find(newUnitId => newUnitId === unit.id)) {
                            unit.employeesCount++
                        }
                        return unit
                    }))
                }
                // -->
                setEmployees(employees.map(employee => {
                    if (employee.id === modalData.employee.id) {
                        employee = res.data
                    }
                    return employee
                }))
                if (modalComponent.onConfirm) {
                    modalComponent.onConfirm(res.data)
                }
                close()
            })
        }

        // ADDING NEW EMPLOYEE
        EmployeeService.AddNewEmployee(newData, (err, res) => {
            if (err || !res) {
                if (err?.response?.status === 422) {
                    setValidation(err.response.data)
                    modalBtn.disabled = false
                }
                return console.log('?????? ???????????????????? ???????????? ???????????????????? ?????????????????? ????????????')
            }
            setUnits(unitItems.map(unit => {
                if (selectedUnits.find(selectedUnitId => selectedUnitId === unit.id)) {
                    unit.employeesCount++
                }
                return unit
            }))
            pushToEmployees(res.data)
            if (modalComponent.onConfirm) {
                modalComponent.onConfirm(res.data)
            }
            close()
        })
    }

    return (
        <div key={ modalComponent.key } className={ clsx(style.create_company_modal) }>
            <p className="modal_title">{ modalData.editMode ? '???????????????? ????????????????????' : '???????????????? ????????????????????' }</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label="??????" variant="filled" placeholder={ '?????? ????????????????????' }
                           defaultValue={ modalData.employee?.name || '' } name={ 'name' } />
                <p className="error-text">{ validation.nameError }</p>
                <TextField label="??????????" placeholder={ '??????????' } variant="filled" name={ 'email' }
                           defaultValue={ modalData.employee?.email || '' } />
                <p className="error-text">{ validation.emailError }</p>
                <TextField label="??????????????" placeholder={ '??????????????' } variant="filled" name={ 'phone' }
                           defaultValue={ modalData.employee?.phone || '' } />
                <Select
                    closeMenuOnSelect={ true }
                    components={ animatedComponents }
                    isMulti
                    value={ selectedUnitOptions }
                    options={ unitOptions }
                    isSearchable
                    placeholder={ '??????????????????????????' }
                    onChange={ values => handleOptionChanging(values as any, 'unit') }
                    styles={ selectColourStyles() }
                    theme={ selectTheme }
                />
                <p className="error-text">{ validation.unitError }</p>
                <Select
                    closeMenuOnSelect={ true }
                    components={ animatedComponents }
                    isMulti
                    value={ selectedPositionOptions }
                    options={ positionOptions }
                    formatGroupLabel={ data => (
                        <div>
                            <span>{ data.label }</span>
                        </div>
                    ) }
                    isSearchable
                    placeholder={ '??????????????????' }
                    onChange={ values => handleOptionChanging(values as any, 'position') }
                    styles={ selectColourStyles() }
                    theme={ selectTheme }
                />
                <p className="error-text">{ validation.positionError }</p>
                <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default CreateEmployeeModal
