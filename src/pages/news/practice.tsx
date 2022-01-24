import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import NewsItems from '@components/news-components'
import { ColorfulButton, Title } from '@components/common/common'
import { ErrorIndicator, Loader } from '@ui/indicators'
// STORE
import {
    $NewsCount,
    $Practices, $PracticesStates,
    fetchPractices
} from '@store/news/news-store'
import { setNewsActionType, setSelectedNewsData } from '@store/news/news-store'
import { $UserRole, UserRoleEnum } from '@store/user-store'

const itemsPerPage = 8

const Practice = () => {
    const userRole = useStore($UserRole)
    const practices = useStore($Practices)
    const { practices: practicesCount } = useStore($NewsCount)
    const { isFetched, isLoading, error } = useStore($PracticesStates)

    useEffect(() => {
        if (!isFetched) {
            fetchPractices({
                skip: practices.length,
                limit: itemsPerPage,
                count: true
            })
        }
        setSelectedNewsData(null)
    }, [])

    const handleShowMore = () => {
        fetchPractices({
            skip: practices.length,
            limit: itemsPerPage
        })
    }

    return (
        <main className='content-container'>
            <div className='content-section'>
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Судебная практика'] }/>
                    <div className="content-title-section-with-btn">
                        <Title text='Судебная практика' />
                        {
                            userRole !== UserRoleEnum.SuperAdmin ? null :
                                <ColorfulButton link={'/news/create'} text={'Создать практику'}
                                                onClick={() => setNewsActionType('createPractice')}
                                />
                        }
                    </div>
                </div>
                {
                    error ? <ErrorIndicator /> : isLoading ? <Loader /> : <NewsItems items={ practices } path='practice' />
                }
                {
                    practices.length >= practicesCount ? null :
                        <button className='pagination-button' onClick={ handleShowMore }>Показать еще</button>
                }
            </div>
        </main>
    )
}

export default Practice