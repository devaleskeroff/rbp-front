import React, { Component } from 'react'
import Slider from 'react-slick'
// UTILS
import { concatApiUrl } from '@utils/api-tools'
// STYLES
import './slider.scss'

// ARROWS

const prevArrow = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
    </svg>
)

const nextArrow = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
    </svg>
)

// SLIDER
class SliderWithNav extends Component<{ images: string[] }> {
    slider1: any
    slider2: any
    state: any

    constructor(props: any) {
        super(props)

        this.state = {
            nav1: null,
            nav2: null,
            images: props.images
        }
    }

    componentDidMount() {
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2
        })
    }

    render() {
        return (
            <div className={'news-slider-container'}>
                <Slider
                    asNavFor={ this.state.nav2 }
                    ref={ slider => (this.slider1 = slider) }
                    prevArrow={prevArrow}
                    nextArrow={nextArrow}
                    infinite={ this.state.images.length > 3 }
                >
                    {
                        this.state.images.map((image: string, idx: number) => {
                            return <img key={idx} src={ concatApiUrl(image) } alt="" />
                        })
                    }
                </Slider>
                <Slider
                    asNavFor={ this.state.nav1 }
                    ref={ slider => (this.slider2 = slider) }
                    slidesToShow={ 3 }
                    swipeToSlide={ true }
                    focusOnSelect={ true }
                    arrows={ false }
                    infinite={ this.state.images.length > 3 }
                >
                    {
                        this.state.images.map((image: string, idx: number) => {
                            return <img key={idx} src={ concatApiUrl(image) } style={{ height: '100px', objectFit: 'cover' }} alt="" />
                        })
                    }
                </Slider>
            </div>
        )
    }
}

export default SliderWithNav
