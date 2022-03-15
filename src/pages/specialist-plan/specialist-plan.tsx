import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import SpecialistListTable from '@components/tables/specialist-list'
import { BreadCrumb, TableTopPanel } from '@components/common'
import { ColorfulButton, Title } from '@components/common/common'
import { ErrorIndicator, Loader } from '@ui/indicators'
// HOOKS
import { useModal } from '@modals/index'
// STORE
import { $User } from '@store/user-store'
import { $Company } from '@store/company/company-store'
import {
    $SpecialistPlans,
    $SpecialistPlansStates,
    fetchSpecialistPlans, setPlans, setPlansError,
    setPlansLoading
} from '@store/specialist-plan-store'
// UTILS
import { concatApiUrl } from '@utils/api-tools'
import { getTextExcerpt } from '@utils/common-utils'
// TYPES
import { CompanyT } from '@interfaces/company/company'
import { UserDataT } from '@interfaces/user'
// STYLES
import style from '@scss/pages/specialist-plan.module.scss'

export enum TaskSortEnum {
    DEFAULT,
    BY_START_DATE,
    BY_FINISH_DATE,
    BY_STATUS
}

const itemsPerPage = 10
const SpecialistPlan = () => {
    // STORES
    const user = useStore($User) as UserDataT
    const company = useStore($Company) as CompanyT
    const { count, rows } = useStore($SpecialistPlans)
    const { isLoading, error } = useStore($SpecialistPlansStates)
    // STATES
    const [selectedCompanyId, setSelectedCompanyId] = useState<number>(company.id)
    const [search, setSearch] = useState<string>('')
    const [sortValue, setSortValue] = useState<TaskSortEnum>(TaskSortEnum.DEFAULT)
    const [offset, setOffset] = useState<number>(0)

    const { open } = useModal()

    useEffect(() => {
        fetchSpecialistPlans({
            companyId: selectedCompanyId,
            count: true,
            offset,
            limit: itemsPerPage
        })
    }, [])

    useEffect(() => {
        setOffset(rows.length)
    }, [rows])

    useEffect(() => {
        switch (sortValue) {
            case TaskSortEnum.BY_START_DATE:
                setPlans({
                    count,
                    rows: rows.map(group => {
                        group.tasks.sort((task1, task2) => task1.startDate - task2.startDate)
                        return group
                    })
                })
                break
            case TaskSortEnum.BY_FINISH_DATE:
                setPlans({
                    count,
                    rows: rows.map(group => {
                        group.tasks.sort((task1, task2) => task1.deadline - task2.deadline)
                        return group
                    })
                })
                break
            case TaskSortEnum.BY_STATUS:
                setPlans({
                    count,
                    rows: rows.map(group => {
                        group.tasks.sort((task1, task2) => task2.status - task1.status)
                        return group
                    })
                })
                break
        }
    }, [sortValue])

    useEffect(() => {
        if (search) {

        }
    }, [search])

    const handleShowMore = () => {
        fetchSpecialistPlans({
            companyId: selectedCompanyId,
            offset,
            limit: itemsPerPage
        })
    }

    const handleCompanyChanging = (companyId: number) => {
        if (companyId !== selectedCompanyId) {
            setSelectedCompanyId(companyId)
            setOffset(0)
            setPlansLoading(true)

            fetchSpecialistPlans({
                companyId,
                count: true,
                offset: 0,
                limit: itemsPerPage,
                cb: (err) => {
                    if (err) {
                        return setPlansError(true)
                    }
                    setPlansLoading(false)
                }
            })
        }
    }

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'План специалиста'] } />
                    <Title text="План специалиста" />
                </div>
                {/* COMPANIES LIST */ }
                <div className={ clsx(style.companies_list) }>
                    {
                        user.companies.map(company => (
                            <div key={ company.id } className={ clsx(style.company_item, {
                                [style.active]: selectedCompanyId === company.id
                            }) } onClick={ () => handleCompanyChanging(company.id) }>
                                <img src={ concatApiUrl(company.image) } alt="" className={ clsx(style.company_img) } />
                                <p className={ clsx(style.company_info_text) }>
                                    {
                                        getTextExcerpt(
                                            `ИНН ${ company.inn }`,
                                            document.documentElement.clientWidth > 1124 ? 25 :
                                                document.documentElement.clientWidth < 480 ? 13 : 20
                                        )
                                    }
                                </p>
                            </div>
                        ))
                    }
                </div>
                {/* CONTENT */ }
                <div className={ clsx(style.plan_content) }>
                    <div className={ clsx(style.plan_top_content) }>
                        <ColorfulButton text="Создать группу" onClick={ () => open('CreatePlanGroupModal', {
                            btnText: 'Создать',
                            modalData: { modalTitle: 'Создать группу', companyId: selectedCompanyId }
                        }) } />
                        <a href={ '/' } className={ clsx(style.download_plan_btn) }>
                            Скачать план компании
                            <img src="/img/static/download.png" alt="" />
                        </a>
                    </div>
                    <TableTopPanel text={ `Групп ${ rows.length }` } options={ [
                        { label: 'По дате начала', value: 1 },
                        { label: 'По дате конца', value: 2 },
                        { label: 'По статусу выполнения', value: 3 }
                    ] } onSearch={ value => setSearch(value) } onSelectOption={ option => setSortValue(option.value) } />
                    { error ? <ErrorIndicator /> : isLoading ? <Loader /> :
                        <SpecialistListTable companyId={ selectedCompanyId } search={ search } /> }
                </div>
                {
                    rows.length < count ?
                        <button className={ `${ clsx(style.pagination_btn) } pagination-button` }
                                onClick={ handleShowMore }>
                            Показать еще
                        </button> : null
                }
            </div>
        </main>
    )
}

export default SpecialistPlan
