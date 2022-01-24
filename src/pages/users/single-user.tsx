import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb, TableTopPanel } from '@components/common'
import { Title } from '@components/common/common'
import UserTable from '@components/tables/users-tables/user-table'
// STORE
import { $User } from '@store/user-store'
import { $Workers, $WorkersDataStates, getWorkers } from '@store/workers-store'
// TYPES
import { UserDataT, WorkerShortDataT } from '@interfaces/user'
// STYLES
import style from '@scss/components/tables/users-table.module.scss'

const SingleUser = () => {
    // STORES
    const user = useStore($User) as UserDataT
    const workers = useStore($Workers)
    const { isFetched } = useStore($WorkersDataStates)
    // STATE
    const [currentWorker, setCurrentWorker] = useState<WorkerShortDataT | null>(null)
    const query = useRouteMatch<{ id: string }>()

    useEffect(() => {
        if (!isFetched) {
            getWorkers({ userId: user.id })
        }
    }, [])

    useEffect(() => {
        if (workers.length > 0) {
            const currentWorker = workers.find(worker => worker.id === +query.params.id)
            if (currentWorker) {
                setCurrentWorker(currentWorker)
            }
        }
    }, [workers])

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Пользователи', 'Пользователь'] } />
                    <Title text='Пользователь' withHistory />
                </div>
                <div className={ clsx(style.user_table_info_block) }>
                    <p className={ clsx(style.user_table_name) }>{ currentWorker?.name }</p>
                    <p className={ clsx(style.user_table_info_text) }>{ currentWorker?.email }</p>
                    <p className={ clsx(style.user_table_info_text) }>Роль: { currentWorker?.role === 2 ? 'Специалист ОТ' : 'Клиент' }</p>
                </div>
                <div className={ clsx(style.user_table_top_panel) }>
                    <TableTopPanel text={`Компаний на поддержке: ${currentWorker?.companies.length || 0}`}
                                   hideSearchPanel hideSelectPanel />
                </div>
                <UserTable worker={currentWorker} />
            </div>
        </main>
    )
}

export default SingleUser