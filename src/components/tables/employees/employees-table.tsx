import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// HOOK
import useModal from '@modals/modal-hook'
// COMPONENTS
import { ErrorIndicator, Loader } from '@ui/indicators'
import { Tooltip } from '@material-ui/core'
// STORE
import { $Employees, $EmployeesStates, setEmployees, setEmployeesLoading } from '@store/company/employees-store'
import { pushToArchiveEmployees } from '@store/company/archive-store'
import { $Units, setUnits } from '@store/company/units-store'
import { $UserRole, UserRoleEnum } from '@store/user-store'
// SERVICE
import EmployeeService from '@services/employee-service'
// UTILS
import { getTextExcerpt } from '@utils/common-utils'
// TYPES
import { EmployeeListDataT, EmployeeTablePropsT } from '@interfaces/company/employees'
// ICONS
import EditIcon from '@assets/images/dark-edit.png'
import ArchiveIcon from '@assets/images/archive.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/company/employees.module.scss'

const EmployeesTable: React.FC<EmployeeTablePropsT> = ({ unitId, items, setItems }) => {
    // STORES & STATES
    const units = useStore($Units)
    const userRole = useStore($UserRole)
    const employees = useStore($Employees)
    const { isLoading, error } = useStore($EmployeesStates)
    const [renderingEmployees, setRenderingEmployees] = useState(typeof items !== 'undefined' ? items : employees)

    const { open } = useModal()
    const history = useHistory()

    useEffect(() => {
        if (typeof items !== 'undefined') {
            if (items !== null) {
                setRenderingEmployees(items)
                setEmployeesLoading(false)
            }
            return
        }
        setRenderingEmployees(employees)
    }, [employees])

    useEffect(() => {
        if (items) {
            setRenderingEmployees(items)
        }
    }, [items])

    const handleAddToArchive = (employee: EmployeeListDataT) => {
        EmployeeService.AddToArchive(employee.id, (err, res) => {
            if (err) {
                return console.log('При добавлении пользователя в архив произошла ошибка')
            }
            if (items && setItems) {
                setItems(items.filter(unitEmployee => unitEmployee.id !== employee.id))
            }
            const employeeUnitsIds = employee.units.map(unit => unit.id)

            setUnits(units.map(unit => {
                if (employeeUnitsIds.find(employeeUnitId => employeeUnitId === unit.id)) {
                    unit.employeesCount--
                }
                return unit
            }))
            pushToArchiveEmployees(employee)
            setEmployees(employees.filter(empl => empl.id !== employee.id))
        })
    }

    const handleEmployeeUpdate = (updatedEmployee: EmployeeListDataT) => {
        if (items && setItems) {
            let updatedEmployees: EmployeeListDataT[]
            const currentUnitRemoved = !updatedEmployee.units.find(unit => unit.id === unitId)

            if (currentUnitRemoved) {
                updatedEmployees = items.filter(employee => employee.id !== updatedEmployee.id)

                setItems(updatedEmployees)
                setRenderingEmployees(updatedEmployees)
            } else {
                updatedEmployees = items.map(employee => {
                    if (employee.id === updatedEmployee.id) {
                        employee = updatedEmployee
                    }
                    return employee
                })

                setItems(updatedEmployees)
                setRenderingEmployees(updatedEmployees)
            }
        }
    }

    const tableBodyContent = renderingEmployees?.map(employee => {
        const firstRow = (
            <label htmlFor={`key`} className={ clsx(tableStyle.column_fixed_height) } onClick={() => (
                history.push(`/company/employees/${employee.id}`)
            )}>
                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name="" id={`key`} />
                <label htmlFor={`key`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </label>
                <label htmlFor={`key`} className={ clsx(tableStyle.checkbox_label) }>{ employee.name }</label>
            </label>
        )

        return (
            <tr key={employee.id}>
                <td>{ firstRow }</td>
                <td>{ getTextExcerpt(employee.units.map(unit => unit.title).join(', '), 35) }</td>
                <td>{ getTextExcerpt(employee.positions.map(pos => pos.title).join(', '), 35) }</td>
                <td>
                {
                    userRole === UserRoleEnum.Client ? null :
                        <div className={ clsx(style.employee_control_col) }>
                            <Tooltip title="Изменить" placement="top">
                                <img src={ EditIcon } alt="" onClick={ () => open('CreateEmployeeModal', {
                                    modalData: { editMode: true, employee },
                                    onConfirm: (employee: EmployeeListDataT) => handleEmployeeUpdate(employee),
                                    btnText: 'Сохранить'
                                }) }/>
                            </Tooltip>
                            <Tooltip title="В архив" placement="top">
                                <img src={ ArchiveIcon } alt="" onClick={ () => handleAddToArchive(employee) }/>
                            </Tooltip>
                            {/* FIXME REMOVE ME IF IM NOT NEEDED */}
                            {/*{*/}
                            {/*    unitPage ?*/}
                            {/*        <Tooltip title="Удалить" placement="top">*/}
                            {/*            <img src={ DeleteIcon } alt="" onClick={ () => open('ConfirmActionModal', {*/}
                            {/*                btnText: 'Удалить',*/}
                            {/*                modalData: { text: `Вы уверены, что хотите удалить сотрудника "${ employee.name }" из данного подразделения?` }*/}
                            {/*            }) } />*/}
                            {/*        </Tooltip> : null*/}
                            {/*}*/}
                        </div>
                }
                </td>
            </tr>
        )
    })

    return (
        <div className={ clsx(tableStyle.base_table_container, style.employee_table) }>
            {
                isLoading ? <Loader /> : error ? <ErrorIndicator /> :
                <table className={ clsx(tableStyle.base_table) }>
                    <thead>
                    <tr>
                        <td>
                            <label>
                                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden name="" disabled />
                                <label>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7" />
                                    </svg>
                                </label>
                                <label className={ clsx(tableStyle.checkbox_label) }>Сотрудник</label>
                            </label>
                        </td>
                        <td>Подразделение</td>
                        <td>Должность</td>
                        <td />
                    </tr>
                    </thead>
                    <tbody>
                    { tableBodyContent }
                    </tbody>
                </table>
            }
        </div>
    )
}

export default EmployeesTable