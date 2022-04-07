import React, { FC, useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// SERVICES
import AuthService from '@services/auth-service'
// STORE
import { $User, UserRoleEnum } from '@store/user-store'
import { $Company } from '@store/company/company-store'
// COMPONENTS
import useModal from '@modals/modal-hook'
import Loader from '@ui/indicators/loader'
// UTILS
import { concatApiUrl } from '@utils/api-tools'
// ICONS
import logo from '@assets/images/header-logo.png'
// TYPES
import { MenuBurgerIconsPropsT, HeaderPropsT } from '@interfaces/common'
import { CompanyT } from '@interfaces/company/company'
import { UserDataT } from '@interfaces/user'
// STYLES
import style from '@scss/components/header.module.scss'

const MenuBurgerIcons: FC<MenuBurgerIconsPropsT> = ({ menuDisplay, onBurgerClick }) => {
    return menuDisplay ?
        <svg className={ clsx(style.menu_burg) } fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg" onClick={ onBurgerClick }>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M6 18L18 6M6 6l12 12" />
        </svg>
        : <svg className={ clsx(style.menu_burg) } fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg" onClick={ onBurgerClick }>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M4 6h16M4 12h16M4 18h16" />
        </svg>
}

const Header: FC<HeaderPropsT> = (props) => {
    // STORE
    const user = useStore($User) as UserDataT
    const company = useStore($Company) as CompanyT
    // STATE
    const [accountPanelDisplay, setAccountPanelDisplay] = useState<boolean>(false)
    // HOOKS
    const { open } = useModal()
    const history = useHistory()

    const { resetActiveNav } = props

    useEffect(() => {
        if (accountPanelDisplay) {
            document.addEventListener('click', clickHandler)
        }
        return () => document.removeEventListener('click', clickHandler)
    }, [accountPanelDisplay])

    const clickHandler = (e: any) => {
        setAccountPanelDisplay(false)
    }

    const handleLogout = () => {
        AuthService.Logout(() => {
            localStorage.removeItem('token')
            history.push('/login')
        })
    }

    return (
        <header className={ clsx(style.header) }>
            <div className={ clsx(style.header_cont) }>
                {/* BURGER ICONS */ }
                <MenuBurgerIcons { ...props } />
                {/* HEADER CONTENT */ }
                <div className={ clsx(style.right_side) }>
                    {/* LOGOS */ }
                    <div className={ clsx(style.flex) }>
                        <Link to={ '/' } onClick={ () => resetActiveNav('') }>
                            <img src={ logo } alt="OT" className={ clsx(style.header_logo) } />
                        </Link>
                        <Link to={ '/company' } onClick={ () => resetActiveNav('/company') }>
                            <img src={ concatApiUrl(company.image) } alt=""
                                 className={ clsx(style.company_logo) } />
                        </Link>
                    </div>
                    {/* ACCOUNT PANEL */ }
                    <div className={ clsx(style.header_account_panel) }>
                        <Link to={ '/profile' } className={ clsx(style.user_small_img_link) }>
                            <img src={ concatApiUrl(user.avatar)  } alt="" className={ clsx(style.user_small_img) } />
                        </Link>
                        {
                            !user || !company ? <Loader /> :
                                <>
                                    <div className={ clsx(style.header_panel_wrapper) }
                                         onClick={ () => setAccountPanelDisplay(!accountPanelDisplay) }>
                                        <div className={ clsx(style.header_user_data) }>
                                            <p className={ clsx(style.user_name) }>{ user.name }</p>
                                            <p className={ clsx(style.company_name) }>{ company.name }</p>
                                        </div>
                                        <img src="/img/static/black-arrow-drop.png" alt=""
                                             className={ clsx(style.dropdown_arrow) } />
                                    </div>
                                </>
                        }
                        {/* ACCOUNT PANEL DROPDOWN CONTENT*/ }
                        <div className={ clsx(style.account_dropdown, {
                            [style.active]: accountPanelDisplay
                        }) }>
                            <div className={ clsx(style.account_dropdown_cont) }>
                                <div className={ clsx(style.user_panel_actions) }>
                                    <button className={ clsx(style.user_panel_action_item) }
                                            onClick={ () => open('CreateCompanyModal') }>
                                        <img src="/img/static/green-plus.png" alt="" />
                                        Создать компанию
                                    </button>
                                    {
                                        user.role !== UserRoleEnum.SuperAdmin ? null :
                                            <button className={ clsx(style.user_panel_action_item) }
                                                    onClick={ () => open('CreateSuperAdminModal', {
                                                        modalData: { modalTitle: 'Добавить суперадмина' }
                                                    }) }>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                                Добавить суперадмина
                                            </button>
                                    }
                                    <Link to={ '/profile' } className={ clsx(style.user_panel_action_item) }
                                          onClick={ () => resetActiveNav('') }>
                                        <img src="/img/static/green-user.png" alt="" />
                                        Моя страница
                                    </Link>
                                    <button className={ clsx(style.user_panel_action_item) }>
                                        <img src="/img/static/qa-icon.png" alt="" />
                                        Подсказки
                                    </button>
                                    <button className={ clsx(style.user_panel_action_item) }>
                                        <img src="/img/static/green-pen.png" alt="" />
                                        Пройти тестирование Vision Zero
                                    </button>
                                    <button className={ clsx(style.user_panel_action_item) } onClick={ handleLogout }>
                                        <img src="/img/static/log-out.png" alt="" />
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
