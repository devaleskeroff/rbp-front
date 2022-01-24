import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { ColorfulButton } from '@components/common/common'
import { EmployeesTable } from '@components/tables'
// STORE
import { $EmployeesStates, fetchEmployees } from '@store/company/employees-store'
import { $UnitState, fetchUnits } from '@store/company/units-store'
// STYLES
import style from '@scss/pages/company/employees.module.scss'

const EmployeesContent = () => {
    const { isFetched } = useStore($EmployeesStates)
    const { isFetched: isUnitsFetched } = useStore($UnitState)
    const { open } = useModal()

    useEffect(() => {
        if (!isFetched) {
            fetchEmployees()
        }
        if (!isUnitsFetched) {
            fetchUnits()
        }
    }, [])

    return (
        <>
            {/* CREATION BUTTON */}
            <div className={ clsx(style.employees_top_panel, style.second_top_panel) }>
                <ColorfulButton text={'Добавить сотрудника'} onClick={() => open('CreateEmployeeModal', {
                    btnText: 'Добавить'
                })} />
            </div>
            {/* TABLE */}
            <EmployeesTable />
        </>
    )
}

export default EmployeesContent