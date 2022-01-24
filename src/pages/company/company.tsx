import React, { useEffect, useState } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
// STORE
// TABS
import CompanyInfo from '@pages/company/company-info'
import Calendar from '@pages/company/calendar'
import Workspace from '@pages/company/workspace'
import Units from '@pages/company/units'
import Employees from '@pages/company/employees'
import Archive from '@pages/company/archive'
import SingleUnit from '@pages/company/single-unit'
// COMPONENTS
import { BreadCrumb, TabItems } from '@components/common'
import { Title } from '@components/common/common'
// STYLES
import '@scss/components/reset-calendar.scss'


const Company = () => {
    // STATE
    const [breadCrumbs, setBreadCrumbs] = useState<Array<string>>(['Главная', 'Компания'])
    const [title, setTitle] = useState<string>('Компания')
    const [withHistory, setWithHistory] = useState<boolean>(false)

    const { pathname } = useLocation()

    useEffect(() => {
        let newTitle: string, newBreadCrumbs: Array<string>

        const regExp = (path: string) => new RegExp(`/company${path}`, 'i')

        if (regExp('$').test(pathname)) {
            newTitle = 'Компания'
            newBreadCrumbs = ['Главная', 'Компания']
            setWithHistory(false)
        }
        else if (regExp('/workspace').test(pathname)) {
            newTitle = 'Рабочий блок'
            newBreadCrumbs = ['Главная', 'Рабочий блок']
        }
        else if (regExp('/units').test(pathname)) {
            newTitle = 'Поздразделения'
            newBreadCrumbs = ['Главная', 'Поздразделения']
        }
        else if (regExp('/employees').test(pathname)) {
            newTitle = 'Сотрудники'
            newBreadCrumbs = ['Главная', 'Сотрудники']
        }
        else if (regExp('/calendar').test(pathname)) {
            newTitle = 'Календарь'
            newBreadCrumbs = ['Главная', 'Календарь']
        }
        else if (regExp('/archive').test(pathname)) {
            newTitle = 'Архив'
            newBreadCrumbs = ['Главная', 'Архив']
        }
        else {
            newTitle = title
            newBreadCrumbs = breadCrumbs
        }

        setTitle(newTitle)
        setBreadCrumbs(newBreadCrumbs)
    }, [pathname])

    return (
        <main className="content-container company">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ breadCrumbs } />
                    <Title text={ title } withHistory={withHistory} />
                </div>
                <div className="tab-section">
                    <div className="tab-cont">
                        {/* TABS */ }
                        <TabItems items={[
                            { label: 'Общая информация', path: '/company', exact: true },
                            { label: 'Рабочий блок', path: '/company/workspace' },
                            { label: 'Подразделения', path: '/company/units' },
                            { label: 'Сотрудники', path: '/company/employees' },
                            { label: 'Календарь', path: '/company/calendar' },
                            { label: 'Архив', path: '/company/archive' }
                        ]} />
                        {/* TAB CONTENTS */}
                        <div className="tab-content-items">
                            <Switch>
                                <Route exact path={'/company'} component={CompanyInfo} />
                                <Route exact path={['/company/workspace', '/company/workspace/:directoryId']}>
                                    <Workspace setWithHistory={setWithHistory} />
                                </Route>
                                <Route exact path={'/company/units'}>
                                    <Units setWithHistory={setWithHistory} />
                                </Route>
                                <Route exact path={'/company/units/:id'} component={SingleUnit} />
                                <Route path={'/company/employees'}>
                                    <Employees setWithHistory={setWithHistory} />
                                </Route>
                                <Route exact path={'/company/calendar'} component={Calendar} />
                                <Route exact path={'/company/archive'}>
                                    <Archive setWithHistory={setWithHistory} />
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Company