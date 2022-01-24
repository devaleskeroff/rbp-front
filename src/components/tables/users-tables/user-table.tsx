import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { ErrorIndicator, Loader } from '@ui/indicators'
import moment from 'moment'
// STORE
import { $WorkersDataStates } from '@store/workers-store'
// TYPES
import { WorkerShortDataT } from '@interfaces/user'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/components/tables/users-table.module.scss'

const UserTable: React.FC<{ worker: WorkerShortDataT | null }> = ({ worker }) => {
    const { error } = useStore($WorkersDataStates)

    const tableBodyContent = worker?.companies.map(company => (
        <tr key={company.id}>
            <td>
                <label htmlFor={`key`} className={ clsx(tableStyle.column_fixed_height) }>
                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name="" id={`key`} />
                    <label htmlFor={`key`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </label>
                    <label htmlFor={`key`} className={ clsx(tableStyle.checkbox_label) }>{ company.name }</label>
                </label>
            </td>
            <td>
                <p className={ clsx(style.user_email) }>{ moment(company.createdAt).format('DD.MM.YYYY') }</p>
            </td>
        </tr>
    ))

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
            {
                error ? <ErrorIndicator /> : !worker ? <Loader /> :
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
                                    <label className={ clsx(tableStyle.checkbox_label) }>Название</label>
                                </label>
                            </td>
                            <td>Дата создания</td>
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

export default UserTable