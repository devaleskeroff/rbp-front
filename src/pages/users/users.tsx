import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { UsersTable } from '../../components/tables'
import { BreadCrumb, TableTopPanel } from '@components/common'
import { ColorfulButton, Title } from '@components/common/common'
import useModal from '@modals/modal-hook'
// STORE
import { $Workers, $WorkersDataStates, getWorkers } from '@store/workers-store'
import { $User } from '@store/user-store'
// TYPES
import { UserDataT } from '@interfaces/user'
// STYLES
import style from '@scss/components/tables/users-table.module.scss'

const Users = () => {
    // STORES
    const user = useStore($User) as UserDataT
    const workers = useStore($Workers)
    const { isFetched } = useStore($WorkersDataStates)

    const { open } = useModal()

    useEffect(() => {
        if (!isFetched) {
            getWorkers({ adminId: user.company.ownerId })
        }
    }, [])

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Пользователи'] } />
                    <div className="content-title-section-with-btn">
                        <Title text='Пользователи' />
                        <ColorfulButton text='Создать пользователя' onClick={() => open('CreateUserModal', {
                            btnText: 'Создать',
                            modalData: { modalTitle: 'Создать пользователя' }
                        })} />
                    </div>
                </div>
                <div className={ clsx(style.users_table_panel) }>
                    <TableTopPanel onSelectOption={ (option) => console.log(option) }
                                   text={`Пользователей: ${workers.length}`} hideSearchPanel hideSelectPanel />
                </div>
                <div className={ clsx(style.users_table_container) }>
                    <UsersTable />
                </div>
            </div>
        </main>
    )
}

export default Users
