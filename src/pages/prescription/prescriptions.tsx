import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb, TableTopPanel } from '@components/common'
import { ColorfulButton, Title } from '@components/common/common'
import { ErrorIndicator, Loader } from '@ui/indicators'
import { PrescriptionItems } from '@components/prescriptions'
// STORE
import {
    $Prescriptions,
    $PrescriptionsStates,
    fetchPrescriptions
} from '@store/prescription-store'
// STYLES
import style from '@scss/pages/prescription/prescriptions.module.scss'

const itemsPerPage = 9

const Prescriptions = () => {
    // STORES
    const { count, rows: prescriptions } = useStore($Prescriptions)
    const { isLoading, error, isFetched } = useStore($PrescriptionsStates)
    // STATES
    const [offset, setOffset] = useState<number>(0)

    useEffect(() => {
        if (!isFetched) {
            fetchPrescriptions({
                count: true,
                offset,
                limit: itemsPerPage
            })
        }
    }, [])

    useEffect(() => {
        setOffset(prescriptions.length)
    }, [prescriptions])

    const handleShowMore = () => {
        fetchPrescriptions({
            offset,
            limit: itemsPerPage
        })
    }

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Предписания'] }/>
                    <Title text="Предписания" />
                </div>
                <div className="bg-white mt-50 rounded-md">
                    {/* TABLE TOP PANEL */ }
                    <TableTopPanel text={ `Предписаний: ${ count }` } hideSearchPanel hideSelectPanel/>
                    <div className="underline"/>
                    {/* PRESCRIPTIONS CONTENT CONTAINER */ }
                    <div className={ clsx(style.prescriptions_content_container) }>
                        {/* CREATION BUTTON */ }
                        <div style={ { width: 'max-content' } }>
                            <ColorfulButton text={ 'Создать предписание' } link={ '/prescriptions/create' }/>
                        </div>
                        {/* PRESCRIPTIONS */ }
                        { error ? <ErrorIndicator /> : isLoading ? <Loader /> : <PrescriptionItems /> }
                        {
                            !error && !isLoading && count ? count > prescriptions.length ?
                                <button className='pagination-button' onClick={ handleShowMore }>Показать еще</button> : null
                                : null
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Prescriptions