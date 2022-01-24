import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import Loader from '@ui/indicators/loader'
import useModal from '@modals/modal-hook'
import { ErrorIndicator } from '@ui/indicators'
// STORE
import { $Workers, $WorkersDataStates } from '@store/workers-store'
// ICONS
import EditIcon from '@assets/images/edit.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/components/tables/users-table.module.scss'
import { Tooltip } from '@material-ui/core'

const UsersTable: React.FC = () => {
    const workers = useStore($Workers)
    const { isLoading, error } = useStore($WorkersDataStates)

    const { open } = useModal()

    const tableBodyContent = workers.map(worker => (
        <tr key={worker.id}>
            <td>
                <Link to={`/users/${worker.id}`}>
                    <label htmlFor={`key`} className={ clsx(tableStyle.column_fixed_height) }>
                        <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name="" id={`key`} />
                        <label htmlFor={`key`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </label>
                        <label htmlFor={`key`} className={ clsx(tableStyle.checkbox_label) }>{ worker.name }</label>
                    </label>
                </Link>
            </td>
            <td>
                <p className={ clsx(style.user_email) }>{ worker.email }</p>
                <Tooltip title="Изменить" placement={'top'}>
                    <button onClick={ () => open('CreateUserModal', {
                        modalData: {
                            modalTitle: 'Изменить пользователя',
                            worker
                        },
                        btnText: 'Сохранить'
                    }) }>
                        <img src={ EditIcon } alt="" className={ clsx(style.edit_icon) } />
                    </button>
                </Tooltip>
            </td>
        </tr>
    ))

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
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
                                    <label className={ clsx(tableStyle.checkbox_label) }>Имя</label>
                                </label>
                            </td>
                            <td>Почта</td>
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

export default UsersTable