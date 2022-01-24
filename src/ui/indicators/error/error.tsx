import React from 'react'
import cx from 'clsx'
// ICON
import Caution from '@assets/images/caution.png'
// STYLE
import style from './error.module.scss'

const ErrorIndicator = () => {

    return (
        <div className={ cx(style.error_container) }>
            <div>
                <img src={ Caution } alt="" className={ cx(style.error_icon) } />
                <p className={ cx(style.error_text) }>Произошла неожиданная ошибка</p>
            </div>
        </div>
    )
}

export default ErrorIndicator