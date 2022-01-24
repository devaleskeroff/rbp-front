import React from 'react'
import clsx from 'clsx'
import * as scss from '@scss/pages/home.module.scss'
let style: any = scss

const NextArrow = (props: any) => {
    const { className, onClick } = props

    return (
        <button onClick={onClick} className={className + ' slick_slider_arrow next_arrow'}>
            <img src='/img/static/slider-next-arrow.png' alt='' />
        </button>
    )
}

const PrevArrow = (props: any) => {
    const { className, onClick } = props

    return (
        <button onClick={onClick} className={className + ' slick_slider_arrow prev_arrow'}>
            <img src='/img/static/slider-prev-arrow.png' alt='' />
        </button>
    )
}

// SLICK SLIDER SETTINGS
export const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: clsx(style.home_slider_dots),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots(dots: React.ReactNode): JSX.Element {
        if (!dots) {
            return <></>
        }
        // @ts-ignore
        const customDots = dots.map(dot => {
            return (
                <button key={dot.key} {...dot.props}
                        className={dot.props.className + ' ' + clsx(style.home_slider_dot)}
                        onClick={dot.props.children.props.onClick} children={null} />
            )
        })
        return <div>{ customDots }</div>
    },
}