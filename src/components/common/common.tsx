import React, { FC } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
// COMPONENTS
import Select, { Styles } from 'react-select'
import { useModal } from '@modals/index'
// ICONS
import EyeIcon from '@assets/images/eye.png'
// TYPES
import {
    ColorfulActionButtonPropsT,
    ItemsOfStringArrayT, SortOptionT,
    TabItemsPropsT,
    TableTopPanelPropsT,
    TitlePropsT
} from '@interfaces/common'
import { WorkspaceFileShortDataT } from '@interfaces/company/workspace'
import {GetFileName} from "@utils/rus-to-latin";

export const BreadCrumb: FC<ItemsOfStringArrayT> = ({ items }) => {
    const content = items.map((item, idx) => {
        return (
            <div key={ idx } className="bread-crumb-item">
                { item }
                {
                    (idx + 1) !== items.length ?
                        <p style={ { margin: '0 10px' } }>/</p>
                        : null
                }
            </div>
        )
    })

    return <div className="bread-crumbs">{ content }</div>
}

export const TableTopPanel = (props: TableTopPanelPropsT) => {
    const { text, options, onSelectOption, onSearch, hideSearchPanel, hideSelectPanel, withoutPadding } = props

    const onSelectOptionsHandler = (option: SortOptionT) => {
        if (onSelectOption) {
            onSelectOption(option)
        }
    }

    let sortOptions = [
        { label: 'Сначала новые', value: 10 },
        { label: 'Сначала старые', value: 20 },
    ]

    if (options) {
        sortOptions = options
    }

    return (
        <div className={`table-top-panel ${withoutPadding ? 'without_padding' : ''}`}>
            <p className="font-semibold">{ text }</p>
            <div className="table-top-panel__widgets">
                <div className={ `search-panel ${withoutPadding ? 'without_margin' : ''} ${ hideSearchPanel ? 'hidden' : '' }` }>
                    <input type="text" name="search" id="search" placeholder="Поиск" className="search-field" />
                    <img src="/img/static/search-icon.png" alt="" className="search-icon"
                         onClick={ () => {
                             const searchingValue = document.querySelector('#search') as HTMLInputElement
                             return onSearch ? onSearch(searchingValue?.value || '') : null
                         } } />
                </div>
                <Select
                    name="sort-option"
                    id='sort-option-select'
                    className={ hideSelectPanel ? 'hidden' : '' }
                    defaultValue={ { label: 'Сортировка', value: 0 } }
                    theme={(theme => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary25: '#eaeaea',
                            primary: '#00B856',
                        }
                    }))}
                    options={sortOptions}
                    onChange={onSelectOptionsHandler as (option: SortOptionT | null) => void}
                />
            </div>
        </div>
    )
}

export const TabItems = ({ items }: TabItemsPropsT) => {
    const { pathname } = useLocation()

    const tabs = items.map((item, idx) => {
        const regExp = new RegExp(`${item.path}${item.exact ? '$' : ''}`, 'i')
        const isActive = regExp.test(pathname)

        return (
            <Link to={item.path} key={idx} className={ `tab-item ${ isActive ? 'active' : '' }` }>
                { item.label }
            </Link>
        )
    })

    return (
        <div className="tab-items">
            { tabs }
        </div>
    )
}

// CHANGING TAB

// export const ToggleTab = (tab: number) => {
//     const tabContents = document.querySelectorAll('.tab-content-item')
//
//     tabContents.forEach(item => {
//         item.classList.add('hidden')
//     })
//
//     tabContents[tab].classList.remove('hidden')
// }

// GREEN BUTTON WITH PAGE TITLE FOR CREATING NEW RESOURCE

export const ColorfulButton: React.FC<ColorfulActionButtonPropsT> = (props) => {
    const { link, text, type, plusIcon = true, customIcon, onClick } = props

    let content = (plusIcon ?
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg> : null
    )

    content = customIcon || content

    if (!link) {
        return (
            <button className="colorful_action_btn" style={{ marginTop: '16px'}}
                    onClick={ () => onClick ? onClick() : null } type={ type || 'submit' }>
                { text }{ content }
            </button>
        )
    }

    return (
        <Link to={ link } className='colorful_action_btn' style={{ marginTop: '16px'}}
              onClick={ () => onClick ? onClick() : null }>{ text }{ content }</Link>
    )
}

// REACT SELECT STYLES
export const selectTheme = (theme: any) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary25: '#eaeaea',
        primary: '#00B856'
    }
})

export const selectColourStyles = (containerStyles: any = {}): Styles<any, any> => ({
    container: (base, props) => ({
        ...base, backgroundColor: '#f5f6fa', marginTop: '15px', minHeight: '55px',
        maxHeight: 'max-content', borderRadius: '20px', ...containerStyles
    }),
    control: styles => ({ ...styles, backgroundColor: '#f5f6fa', minHeight: '55px', height: '100%', border: 'none' }),
    multiValue: base => ({
        ...base, fontSize: '18px', backgroundColor: '#eeeeee'
    })
})

// CONTENT TITLE

export const Title: React.FC<TitlePropsT> = ({ text, withHistory }) => {
    const history = useHistory()

    if (withHistory) {
        return (
            <h1 className="content-title clickable" onClick={ () => history.goBack() }>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M15 19l-7-7 7-7" />
                </svg>
                { text }
            </h1>
        )
    }

    return <h1 className="content-title">{ text }</h1>
}

export const DocumentViewButton: React.FC<{ file: WorkspaceFileShortDataT | string }> = ({ file }) => {
    const { open } = useModal()

    const viewBtnForImageAndPdf = (
        <button>
            <a href={ process.env.API_URL + (typeof file === 'string' ? file : file.path) } target='_blank' rel='noreferrer'>
                <img src={ EyeIcon } alt="Посмотреть" />
            </a>
        </button>
    )
    // TODO @deprecated remove later & DocumentViewModal as well
    const viewBtnForDoc = (
        <button>
            <img src={ EyeIcon } alt="Посмотреть" onClick={ () => open('DocumentViewModal', {
                modalData: { src: typeof file === 'string' ? file : file.path }
            }) }/>
        </button>
    )

    const viewBtnForDocInEditor = () => {
        if (typeof file === 'string') {
            return null
        }
        const pathHash = btoa(`${ process.env.API_URL }/api/v1/file/${ file.id }?type=workspace&hash=${ file.hash }`)
        const filename = GetFileName(file.title, file.extension)
        const fullEditorUrl = `${process.env.EDITOR_URL}/?document=${pathHash}&filename=${filename}&mode=readonly`

        return (
            <button>
                <a href={ fullEditorUrl } target='_blank' rel='noreferrer'>
                    <img src={EyeIcon} alt="Посмотреть"/>
                </a>
            </button>
        )
    }
    const extension = typeof file === 'string' ? file.split('.')[1] : file.extension

    switch (extension) {
        case 'jpeg': return viewBtnForImageAndPdf
        case 'jpg': return viewBtnForImageAndPdf
        case 'png': return viewBtnForImageAndPdf
        case 'pdf': return viewBtnForImageAndPdf
        case 'docx': return viewBtnForDocInEditor()
        case 'xml': return viewBtnForDocInEditor()
        case 'xls': return viewBtnForDocInEditor()
        case 'xlsx': return viewBtnForDocInEditor()
        default: return null
    }
}