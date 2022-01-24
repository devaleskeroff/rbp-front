import React from 'react'
import clsx from 'clsx'
import { useStore } from 'effector-react'
// COMPONENTS
import Loader from '@ui/indicators/loader'
import useModal from '@modals/modal-hook'
// SERVICES
import CompanyService from '@services/company-service'
// STORE
import { $Company } from '@store/company/company-store'
import { $UserRole, UserRoleEnum } from '@store/user-store'
// TYPES
import { CompanyTabPropsT } from '@interfaces/company/company'
// STYLES
import style from '@scss/pages/company/company-info.module.scss'

const CompanyInfo: React.FC<CompanyTabPropsT> = () => {
    const userRole = useStore($UserRole)
    const company = useStore($Company)
    const { open } = useModal()

    if (company === null) {
        return <Loader />
    }

    if (company === false) {
        return <>Произошла ошибка</>
    }

    const onEditCompany = () => {
        CompanyService.GetCompany(company.id, (err, res) => {
            if (err || !res) {
                return console.log('Произошла ошибка при получении данных компании')
            }

            open('CreateCompanyModal', {
                btnText: 'Сохранить',
                modalData: res.data
            })
        })
    }

    return (
        <section className={ `tab-content-item ${ clsx(style.company_info) }` }>
            <div className={ clsx(style.tab_top_content) }>
                <h5 className={ clsx(style.company_name) }>{ company.name }</h5>
                {
                    userRole === UserRoleEnum.Client ? null :
                        <button className={ clsx(style.company_edit_btn) } onClick={ onEditCompany }>
                            Редактировать
                        </button>
                }
            </div>
            <img className={ clsx(style.company_info_content_logo) } src={ process.env.API_URL + company.image } alt="" />
            {/* INFO SECTION */ }
            <div className={ clsx(style.company_info_section) }>
                <p className={ clsx(style.company_info__item) }>
                    Юр. лицо: <span>{ company.legalEntity }</span>
                </p>
                <p className={ clsx(style.company_info__item) }>
                    ИНН: <span>{ company.inn }</span>
                </p>
                <p className={ clsx(style.company_info__item) }>
                    Адрес физический: <span>{ company.physicalAddress }</span>
                </p>
                <p className={ clsx(style.company_info__item) }>
                    Адрес юридический: <span>{ company.legalAddress }</span>
                </p>
                <p className={ clsx(style.company_info__item) }>
                    Описание: <span>{ company.shortDesc }</span>
                </p>
                <div className={ clsx(style.underline) } />
                {
                    company.clients.length === 0 ? null :
                        <div className={ clsx(style.company_info_group) }>
                            <p className={ clsx(style.company_info__item) }>Генеральный директор:</p>
                            <div className={ clsx(style.company_info_group__list) }>
                                {
                                    company?.clients?.map(client => (
                                        <p key={ client.id } className={ clsx(style.company_info__item) }>
                                            <span>{ client.name }</span>
                                        </p>
                                    ))
                                }
                            </div>
                        </div>
                }
                {
                    company.specialists.length === 0 ? null :
                        <div className={ clsx(style.company_info_group) }>
                            <p className={ clsx(style.company_info__item) }>Специалисты по ОТ:</p>
                            <div className={ clsx(style.company_info_group__list) }>
                                {
                                    company?.specialists?.map(specialist => (
                                        <p key={ specialist.id } className={ clsx(style.company_info__item) }>
                                            <span>{ specialist.name }</span>
                                        </p>
                                    ))
                                }
                            </div>
                        </div>
                }
            </div>
        </section>
    )
}

export default CompanyInfo