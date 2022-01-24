import React from 'react'
import { Switch, Route } from 'react-router-dom'
// PAGES
import EmployeesContent from '@pages/company/employees/employees-content'
import SingleEmployee from '@pages/company/employees/single-employee'
// TYPES
import { CompanyTabPropsT } from '@interfaces/company/company'

const Employees: React.FC<CompanyTabPropsT> = ({ setWithHistory }) => {
    return (
        <div className="tab-content-item">
            <Switch>
                <Route exact path='/company/employees' component={EmployeesContent} />
                <Route exact path={'/company/employees/:id'}>
                    <SingleEmployee setWithHistory={setWithHistory} />
                </Route>
            </Switch>
        </div>
    )
}

export default Employees
