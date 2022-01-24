import React from 'react'
import clsx from 'clsx'
import ReactLoader from 'react-loader-spinner'
import style from './loader.module.scss'

type Types =
    | 'Audio'
    | 'BallTriangle'
    | 'Bars'
    | 'Circles'
    | 'Grid'
    | 'Hearts'
    | 'MutatingDots'
    | 'Oval'
    | 'Plane'
    | 'Puff'
    | 'RevolvingDot'
    | 'Rings'
    | 'TailSpin'
    | 'ThreeDots'
    | 'Triangle'
    | 'Watch';

type LoaderPropsT = {
    type?: Types;
    fullHeight?: boolean;
    height?: number;
    width?: number;
    className?: string;
    autoHeight?: boolean
};

const Loader: React.FC<LoaderPropsT> = ({ autoHeight, type = 'Oval', fullHeight, className, height, width }) => {
    return (
        <div className={ clsx(style.Loader, className, {
            [style.Loader__fullH]: fullHeight,
            [style.autoHeight]: autoHeight
        })
        }>
            <ReactLoader height={ height } width={ width } type={ type } color="#00963E" />
        </div>
    )
}

export default Loader