import React from 'react'
import clsx from 'clsx'
// COMPONENTS
import moment from 'moment'
// TYPES
import { TaskChangeHistoryT } from '@interfaces/specialist-plan'
// STYLES
import style from '@scss/pages/specialist-plan.module.scss'
import tableStyle from '@scss/components/tables/base-table.module.scss'

const TaskHistoryTable: React.FC<{ history: TaskChangeHistoryT[] }> = ({ history }) => {

    const tableBody = history.map(change => (
        <tr key={ change.id }>
            <td>{ moment(change.updatedAt).format('DD.MM.YYYY') }</td>
            <td>{ moment(change.oldDeadLine).format('DD.MM.YYYY') }</td>
            <td>
                <div className={ clsx(style.change_text_row) }>
                    Изменен на
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </td>
            <td>{ moment(change.newDeadLine).format('DD.MM.YYYY') }</td>
        </tr>
    ))

    return (
        <div className={ clsx(tableStyle.base_table_container, style.task_history_table) }>
            <table className={ clsx(tableStyle.base_table) }>
                <thead>
                <tr>
                    <td>Дата изменения</td>
                    <td>Крайний срок</td>
                    <td>Изменение</td>
                    <td>Новый крайний срок</td>
                </tr>
                </thead>
                <tbody>
                { tableBody }
                </tbody>
            </table>
        </div>
    )
}

export default TaskHistoryTable