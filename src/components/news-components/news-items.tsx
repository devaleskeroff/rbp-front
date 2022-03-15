import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import moment from 'moment'
// UTILS
import { concatApiUrl } from '@utils/api-tools'
import { getTextWithAnchors } from '@utils/common-utils'
// STORE
import { setSelectedNewsData } from '@store/news/news-store'
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'
// TYPES
import { NewsT } from '@interfaces/news'
// STYLE
import style from '@scss/pages/news-and-practice/news-and-practice.module.scss'

type NewsItemsPropsT = {
    items: NewsT[]
    path: string
    limit?: number
}

const NewsItems: React.FC<NewsItemsPropsT> = ({ items, path, limit }) => {
    const permissions = useStore($UserAddPermissions)

    if (limit) {
        items = items.slice(0,limit)
    }

    const content = items.map((item, idx) => {
        return (
            <div key={ idx } className={ clsx(style.news_item) }>
                <Link to={ `/${ path.toLowerCase() }/${ item.id }` } onClick={() => setSelectedNewsData(item)}>
                    <div className={ `${ clsx(style.img_section) }` }>
                        <img src={ concatApiUrl(JSON.parse(item.images)[0]) } alt="" />
                    </div>
                    <div className={ clsx(style.info_section) }>
                        {
                            permissions.roleIsIn([UserRoleEnum.Client]) ? null :
                                <div className={ clsx(style.tags) }>
                                    {
                                        item.tags.split(',').map((tagText, idx) => (
                                            <p key={ idx } className={ clsx(style.tag_item) }>#{ tagText.trim() }</p>
                                        ))
                                    }
                                </div>
                        }
                        <p className={ clsx(style.news_title) }>{ item.title }</p>
                        <p className={ clsx(style.news_date) }>{ moment(item.createdAt).format('LLL') }</p>
                        <p className={ clsx(style.news_desc) }
                           dangerouslySetInnerHTML={{ __html: getTextWithAnchors(item.text) }}
                        />
                    </div>
                </Link>
            </div>
        )
    })

    return (
        <div className={ clsx(style.news_items) }>
            { content }
        </div>
    )
}

export default NewsItems
