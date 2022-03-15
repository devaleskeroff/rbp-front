import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
// PAGES
import EmployeesContent from '@pages/company/employees/employees-content'
import SingleEmployee from '@pages/company/employees/single-employee'
// STORE
import { setModule } from '@store/user-store'
// TYPES
import { CompanyTabPropsT } from '@interfaces/company/company'
import { Modules } from '@interfaces/common'

const Employees: React.FC<CompanyTabPropsT> = ({ setWithHistory }) => {

    useEffect(() => {
        setModule(Modules.SUBDIVISION)
    }, [])

    return (
        <div className="tab-content-item">
            <Switch>
                <Route exact path='/company/employees' component={ EmployeesContent } />
                <Route exact path={'/company/employees/:id'}>
                    <SingleEmployee setWithHistory={setWithHistory} />
                </Route>
            </Switch>
        </div>
    )
}

export default Employees
