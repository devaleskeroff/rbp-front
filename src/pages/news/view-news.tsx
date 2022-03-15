import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { BreadCrumb } from '@components/common'
import { ColorfulButton, Title } from '@components/common/common'
import SliderWithNav from '../../ui/sliders/slider-with-nav'
import NewsItems from '@components/news-components'
// COMPONENTS
import { ErrorIndicator, Loader } from '@ui/indicators'
import moment from 'moment'
// SERVICE
import NewsService from '@services/news-service'
// STORE
import {
    $SelectedNewsData,
    $SpecHelps,
    removeItemFromSpecHelps,
    setNewsActionType,
    setSelectedNewsData,
} from '@store/news/news-store'
import {
    $News,
    $Practices,
    removeItemFromNews,
    removeItemFromPractices,
} from '@store/news/news-store'
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'
// UTILS
import { getTextWithAnchors } from '@utils/common-utils'
// TYPES
import { NewsT, NewsType } from '@interfaces/news'
// STYLES
import style from '@scss/pages/news-and-practice/news-and-practice.module.scss'

const ViewNews: React.FC<{ path: NewsType }> = ({ path }) => {
    // STORES
    const permissions = useStore($UserAddPermissions)
    const currentItem = useStore($SelectedNewsData)
    const news = useStore($News)
    const practices = useStore($Practices)
    const specHelps = useStore($SpecHelps)
    // STATES
    const [breadCrumbs, setBreadCrumbs] = useState<string[]>([])
    const [otherNews, setOtherNews] = useState<NewsT[]>([])
    const [states, setStates] = useState({
        isPending: true,
        error: false
    })

    const { open } = useModal()
    const history = useHistory()
    const query = useRouteMatch<{ id: string }>()

    const updateOtherNews = useCallback(() => {
        setOtherNews(
            path === 'PRACTICE' ?
                practices.filter(item => item.id !== +query.params.id).slice(0, 3)
                : path === 'SPEC_HELP' ?
                    specHelps.filter(item => item.id !== +query.params.id).slice(0, 3) :
                    news.filter(item => item.id !== +query.params.id).slice(0, 3)
        )
    }, [news, practices, specHelps])

    useEffect(() => {
        switch (path) {
            case 'PRACTICE':
                setBreadCrumbs(['Главная', 'Судебная практика', 'Практика'])
                break;
            case 'SPEC_HELP':
                setBreadCrumbs(['Главная', 'Помощь специалисту', 'Помощь'])
                break;
            default: setBreadCrumbs(['Главная', 'Новости', 'Новость'])
        }
    }, [path])

    useEffect(() => {
        if (!currentItem) {
            NewsService.GetNewsById(+query.params.id, path, (err, res) => {
                if (err || !res) {
                    return setStates({ isPending: false, error: true })
                }
                setSelectedNewsData(res.data)
                updateOtherNews()
                setStates({ error: false, isPending: false })
            })
            return
        }
        setStates({ error: false, isPending: false })
        updateOtherNews()
    }, [])

    useEffect(updateOtherNews, [query, updateOtherNews])

    const onDeleteNews = (id: number) => {
        NewsService.DeleteNews(id, path, (err, res) => {
            if (err || !res) {
                return console.log('При удалении новости произошла ошибка')
            }
            if (path === 'PRACTICE') {
                removeItemFromPractices(id)
                return history.push('/practices')
            } else if (path === 'SPEC_HELP') {
                removeItemFromSpecHelps(id)
                return history.push('/help')
            }
            removeItemFromNews(id)
            return history.push('/news')
        })
    }

    return (
        <main className='content-container'>
            <div className='content-section'>
                <div className="top-content">
                    <BreadCrumb items={ breadCrumbs }/>
                    <div className="content-title-section-with-btn">
                        <Title text={breadCrumbs[1]} withHistory />
                        {
                            states.error ? <ErrorIndicator /> : states.isPending ? <Loader /> : !currentItem ? null :
                                <div className='flex flex-wrap'>
                                    {
                                        permissions.roleIsNotIn([UserRoleEnum.SuperAdmin]) ? null :
                                        <>
                                            <ColorfulButton
                                                link={ `/${ path === 'SPEC_HELP' ? 'help': path.toLowerCase() }/${ 1 }/edit` }
                                                text={ 'Изменить новость' }
                                                plusIcon={ false }
                                                onClick={ () => {
                                                    setNewsActionType(
                                                        path === 'PRACTICE' ? 'editPractice' :
                                                        path === 'SPEC_HELP' ? 'editSpecHelp' : 'editNews'
                                                    )
                                                    setSelectedNewsData(currentItem)
                                                } }
                                            />
                                            <ColorfulButton
                                                text={ 'Удалить' } plusIcon={ false }
                                                onClick={ () => open('ConfirmActionModal', {
                                                    onConfirm: () => onDeleteNews(currentItem.id),
                                                    modalData: { text: `Вы уверены, что хотите удалить запись "${ currentItem.title }"?` },
                                                    btnText: 'Удалить'
                                                }) }
                                            />
                                        </>
                                    }
                                </div>
                        }
                    </div>
                </div>
                {
                    states.error ? <ErrorIndicator /> : states.isPending ? <Loader /> : !currentItem ? null :
                        <div className={ clsx(style.view_news_container) }>
                            <div className={ clsx(style.view_news_slider_section, style.view_news_section) }>
                                <SliderWithNav key={currentItem.id} images={ JSON.parse(currentItem.images) as string[] } />
                            </div>
                            <div className={ clsx(style.view_news_content_section, style.view_news_section) }>
                                <p className={ clsx(style.view_news_title) }>{ currentItem.title }</p>
                                <p className={ clsx(style.view_news_gray_text) }>
                                    { moment(currentItem.createdAt).format('LLL') }
                                </p>
                                {
                                    permissions.roleIsIn([UserRoleEnum.Client]) ? null :
                                        <div className={ clsx(style.view_news__tag_items) }>
                                            {
                                                currentItem.tags.split(',').map((tagText, idx) => (
                                                    <p key={ idx } className={ clsx(style.tag_item) }>#{ tagText.trim() } </p>
                                                ))
                                            }
                                        </div>
                                }
                                <p className={ clsx(style.view_news_text) }
                                   dangerouslySetInnerHTML={{ __html: getTextWithAnchors(currentItem.text) }}
                                />
                            </div>
                        </div>
                }
                {
                    otherNews.length > 0 ?
                        <div className={ clsx(style.additional_news) }>
                            <p className={ clsx(style.add_section_title) }>Читайте еще</p>
                            <NewsItems items={otherNews} path={path} />
                        </div> : null
                }
            </div>
        </main>
    )
}

export default ViewNews
