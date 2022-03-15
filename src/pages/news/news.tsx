import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import NewsItems from '@components/news-components'
import { ColorfulButton, Title } from '@components/common/common'
import { ErrorIndicator, Loader } from '@ui/indicators'
// STORE
import { setNewsActionType, setSelectedNewsData } from '@store/news/news-store'
import { $News, $NewsCount, $NewsStates, fetchNews } from '@store/news/news-store'
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'

const itemsPerPage = 8

const News = () => {
    const permissions = useStore($UserAddPermissions)
    const news = useStore($News)
    const { news: newsCount } = useStore($NewsCount)
    const { isFetched, isLoading, error } = useStore($NewsStates)

    useEffect(() => {
        if (!isFetched) {
            fetchNews({
                skip: news.length,
                limit: itemsPerPage,
                count: true
            })
        }
        setSelectedNewsData(null)
    }, [])

    const handleShowMore = () => {
        fetchNews({
            skip: news.length,
            limit: itemsPerPage
        })
    }

    return (
        <main className='content-container'>
            <div className='content-section'>
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Новости'] }/>
                    <div className="content-title-section-with-btn">
                        <Title text='Новости' />
                        {
                            permissions.roleIsNotIn([UserRoleEnum.SuperAdmin]) ? null :
                                <ColorfulButton link={'/news/create'} text={'Создать новость'}
                                                onClick={ () => setNewsActionType('createNews') }
                                />
                        }
                    </div>
                </div>
                {
                    error ? <ErrorIndicator /> : isLoading ? <Loader /> : <NewsItems items={ news } path='news' />
                }
                {
                    news.length >= newsCount ? null :
                        <button className='pagination-button' onClick={ handleShowMore }>Показать еще</button>
                }
            </div>
        </main>
    )
}

export default News
