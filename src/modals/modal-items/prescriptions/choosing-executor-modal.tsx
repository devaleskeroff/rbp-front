import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
// HOOK
import { useModal } from '@modals/index'
// STYLE
import style from '@scss/modals/prescriptions/choosing-executor.module.scss'
import { useStore } from 'effector-react/effector-react.cjs'
import { $ExecutorsStates, $PrescriptionExecutors, fetchPrescriptionExecutors } from '@store/prescription-store'
import { TableTopPanel } from '@components/common'

const ChoosingExecutorModal = () => {
    // STORES
    const { count, rows: executors } = useStore($PrescriptionExecutors)
    const { isFetched } = useStore($ExecutorsStates)
    // STATES
    const [searchString, setSearchString] = useState('')
    const [requestsBlocked, setBlockRequests] = useState<boolean>(false)

    const { modalComponent, modalData, close } = useModal()

    useEffect(() => {
        if (!isFetched) {
            setBlockRequests(true)
            fetchPrescriptionExecutors({
                count: true,
                cb: () => setBlockRequests(false)
            })
        } else if (!requestsBlocked) {
            setBlockRequests(true)
            fetchPrescriptionExecutors({
                offset: 0,
                search: searchString,
                count: !searchString,
                cb: () => setBlockRequests(false)
            })
        }
    }, [searchString])

    const scrollHandler = ({ target }: any) => {
        if (count > executors.length &&
            target.scrollHeight - target.scrollTop === target.clientHeight &&
            !requestsBlocked
        ) {
            setBlockRequests(true)
            fetchPrescriptionExecutors({
                search: searchString,
                cb: () => setBlockRequests(false)
            })
        }
    }

    return (
        <div key={modalComponent.key} className={ clsx(style.confirm_modal) }>
            <p className="modal_title">Выберите исполнителя</p>
            <div className="underline" />
            <div className="modal_content">
                <TableTopPanel text={'ФИО'} hideSelectPanel withoutPadding onSearch={ setSearchString } />
                <div className={ clsx(style.executors_list) } onScroll={ scrollHandler }>
                    {
                        executors.map(executor => (
                            <div key={executor.id} className={ clsx(style.executor_row_item) }
                                 onClick={ () => {
                                     modalData.onSelect(executor.id, executor.name)
                                     close()
                                 } }>
                                { executor.name }
                            </div>
                        ))
                    }
                </div>
                <p className={ clsx(style.confirm_modal_text) }>{ modalData.text }</p>
                <button type='submit' className={`modal_btn ${clsx(style.close_button)}`} onClick={ close }>
                    Закрыть
                </button>
            </div>
        </div>
    )
}

export default ChoosingExecutorModal