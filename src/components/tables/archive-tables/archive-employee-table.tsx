import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { ErrorIndicator, Loader } from '@ui/indicators'
// SERVICE
import ArchiveService from '@services/archive-service'
// TYPES
import {
    $ArchiveEmployees,
    $ArchiveEmployeesStates,
    setArchiveEmployees,
    setArchiveEmployeesError,
    setArchiveEmployeesFetched,
    setArchiveEmployeesLoading
} from '@store/company/archive-store'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/company/archive.module.scss'

const ArchiveEmployeeTable: React.FC = () => {
    const archiveEmployees = useStore($ArchiveEmployees)
    const { isFetched, isLoading, error } = useStore($ArchiveEmployeesStates)

    const history = useHistory()

    useEffect(() => {
        if (!isFetched) {
            setArchiveEmployeesLoading(true)

            ArchiveService.GetArchiveEmployees((err, res) => {
                if (err || !res) {
                    return setArchiveEmployeesError(true)
                }
                setArchiveEmployees(res.data)
                setArchiveEmployeesFetched(true)
                setArchiveEmployeesLoading(false)
            })
        }
    }, [])

    const tableBodyContent = archiveEmployees.map(employee => {
        const firstRow = (
            <label htmlFor={`key`} className={ clsx(tableStyle.column_fixed_height) }>
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
                <td>{
                    employee.units
                        .filter((unit, idx) => idx < 3)
                        .map((unit, idx) => (idx === 0 ? '' : ', ') + unit.title)
                }</td>
                <td>{
                    employee.positions
                        .filter((pos, idx) => idx < 3)
                        .map((pos, idx) => (idx === 0 ? '' : ', ') + pos.title)
                }</td>
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

export default ArchiveEmployeeTable