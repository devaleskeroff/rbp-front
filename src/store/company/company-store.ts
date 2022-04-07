import Fetcher from '@http/fetcher'
import { createEvent, createStore } from 'effector'
import { createEffect } from 'effector/compat'
// STORE
import { resetAllStates } from '@store/user-store'
// TYPES
import { SwitchCompanyResT } from '@interfaces/requests/company'
import { setSelectedCompanyId } from '@store/user-store'
import { CompanyT } from '@interfaces/company/company'
import {setWpGroups} from "@store/company/workspace-store";

// COMPANY STORE
export const setCompany = createEvent<CompanyT | false>()
export const resetCompany = createEvent()

export const $Company = createStore<CompanyT | null | false>(null)
    .on(setCompany, (state, newData) => newData)
    .reset(resetCompany)

// REQUESTS
export const switchCompany = createEffect<SwitchCompanyResT>(async ({ id }) => {
    try {
        const res = await Fetcher.get<{ token: string, company: CompanyT }>(`/company/${ id }/switch`)

        res.data.company.image = res.data.company.image || '/static/images/dummy-logo.png'

        resetAllStates()
        setCompany(res.data.company)
        setWpGroups(res.data.company.groups)
        setSelectedCompanyId({
            ownerId: res.data.company.ownerId,
            companyId: res.data.company.id
        })
        localStorage.setItem('token', res.data.token)
    } catch (err) {
        console.log(err)
    }
})
