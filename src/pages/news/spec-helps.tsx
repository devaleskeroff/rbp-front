import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import NewsItems from '@components/news-components'
import { ColorfulButton, Title } from '@components/common/common'
import { ErrorIndicator, Loader } from '@ui/indicators'
// STORE
import {
    $SpecHelps,
    $SpecHelpsStates,
    fetchSpecHelps,
    setNewsActionType,
    setSelectedNewsData,
} from '@store/news/news-store'
import { $NewsCount } from '@store/news/news-store'
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'

const itemsPerPage = 8

const SpecHelps = () => {
    const permissions = useStore($UserAddPermissions)
    const specHelpsNews = useStore($SpecHelps)
    const { specHelps: specHelpsCount } = useStore($NewsCount)
    const { isFetched, isLoading, error } = useStore($SpecHelpsStates)

    useEffect(() => {
        if (!isFetched) {
            fetchSpecHelps({
                skip: specHelpsNews.length,
                limit: itemsPerPage,
                count: true
            })
        }
        setSelectedNewsData(null)
    }, [])

    const handleShowMore = () => {
        fetchSpecHelps({
            skip: specHelpsNews.length,
            limit: itemsPerPage
        })
    }

    return (
        <main className='content-container'>
            <div className='content-section'>
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Помощь специалисту'] }/>
                    <div className="content-title-section-with-btn">
                        <Title text='Новости' />
                        {
                            permissions.roleIsNotIn([UserRoleEnum.SuperAdmin]) ? null :
                                <ColorfulButton link={'/news/create'} text={'Создать новость'}
                                                onClick={ () => setNewsActionType('createSpecHelp') }
                                />
                        }
                    </div>
                </div>
                {
                    error ? <ErrorIndicator /> : isLoading ? <Loader /> : <NewsItems items={ specHelpsNews } path='help' />
                }
                {
                    specHelpsNews.length >= specHelpsCount ? null :
                        <button className='pagination-button' onClick={ handleShowMore }>Показать еще</button>
                }
            </div>
        </main>
    )
}

export default SpecHelps
