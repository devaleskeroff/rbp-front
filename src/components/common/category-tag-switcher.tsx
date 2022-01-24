import React from 'react'
import clsx from 'clsx'
// TYPES
import { CourseTagsPropsT, CourseCategoriesPropsT } from '@interfaces/study-center'
// STYLE
import style from '@scss/common/common-components.module.scss'

export const Categories = ({ items, onClick }: CourseCategoriesPropsT) => {
    const clickHandler = (e: any) => {
        const categoryItems = document.querySelectorAll('.' + clsx(style.category_btn)) as NodeListOf<HTMLButtonElement>

        categoryItems.forEach(item => item.classList.remove(clsx(style.active)))
        e.target.classList.add(clsx(style.active))

        onClick(e)
    }

    const content = items.map(({ value, label }, idx) => {
        return (
            <button key={idx} className={`${clsx(style.category_btn)} ${idx === 0 ? clsx(style.active) : ''}`}
                    datatype={value} onClick={ clickHandler }>
                { label }
            </button>
        )
    })

    return (
        <div className={ clsx(style.categories) }>{ content }</div>
    )
}

export const Tags = ({ items, selectedTag, onClick }: CourseTagsPropsT) => {

    const clickHandler = (e: any) => {
        const tagItems = document.querySelectorAll('.' + clsx(style.tag_item)) as NodeListOf<HTMLButtonElement>

        tagItems.forEach(item => item.classList.remove(clsx(style.active)))
        e.target.classList.add(clsx(style.active))

        onClick(e)
    }

    const content = items.map((text, idx) => {
        return (
            <button key={idx} className={`${clsx(style.tag_item)} 
         ${text === selectedTag || (!selectedTag && idx === 0) ? clsx(style.active) : ''}`}
                    onClick={clickHandler} datatype={idx === 0 ? 'all' : text}>
                { text }
            </button>

        )
    })

    return (
        <div className={ clsx(style.tags) }>
            { content }
        </div>
    )
}