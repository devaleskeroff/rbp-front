import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'
import clsx from 'clsx'
// HOOK
import { useModal } from '@modals/index'
// SERVICE
import EmployeeService from '@services/employee-service'
// UTILS
import { RusToLatin } from "@utils/rus-to-latin";
// TYPES
import { SigningDocumentsPropsT } from '@interfaces/signing-documents'
import { SigningDocumentT } from '@interfaces/company/employees'
// STYLES
import style from '@scss/pages/signing-documents.module.scss'

export const Documents: React.FC<SigningDocumentsPropsT> = ({ items, onReadyToSign }) => {
    const [docs, setDocs] = useState<SigningDocumentT[]>(items)
    const [params, setParams] = useState({
        companyId: 0,
        verifyingId: ''
    })
    const location = useLocation()

    useEffect(() => {
        const Querystring = qs.parse(location.search, { ignoreQueryPrefix: true })
        setParams({
            companyId: +(Querystring.company as string),
            verifyingId: Querystring.hash as string
        })
    }, [])

    useEffect(() => {
        const isNotViewedDoc = docs.find(doc => !doc.viewed)

        if (!isNotViewedDoc) {
            onReadyToSign()
        }
    }, [docs])

    const handleOnClick = (signature: SigningDocumentT) => {
        const extension = signature.file.path.substring(signature.file.path.lastIndexOf('.') + 1)

        const anchorElement = document.createElement('a')
        anchorElement.setAttribute('target', '_blank')

        switch (extension) {
            case 'jpg': case 'jpeg': case 'png': case 'pdf':
                anchorElement.setAttribute('href', process.env.API_URL + signature.file.path)
                anchorElement.click()
                break;
            case 'docx': case 'xlsx':
                const hash = btoa(signature.file.path)
                const filename = RusToLatin(signature.file.title)
                anchorElement.setAttribute('href', `${process.env.EDITOR_URL}/?document=${hash}&filename=${filename}&mode=readonly`)
                anchorElement.click()
                break;
            case 'doc':
                const file = signature.file
                anchorElement.setAttribute('href', `${process.env.API_URL}/api/v1/company/1/file/${file.id}?type=workspace&hash=${file.hash}`)
                anchorElement.click()
                break;
            default: return;
        }
        // TODO CHECK AND REMOVE THIS MODAL LATER IF IS NOT IN USE
        // open('DocumentViewModal', {
        //     modalData: { src: signature.file.path }
        // })
        if (!signature.viewed) {
            setDocs(docs.map(doc => {
                if (doc.id === signature.id) {
                    doc.viewed = 1
                    EmployeeService.MarkDocumentAsViewed(params.companyId, signature.id, params.verifyingId, (err, res) => {
                        if (err) {
                            return console.log('Не получилось отметить файл просмотренным')
                        }
                    })
                }
                return doc
            }))
        }
    }

    const content = docs.map(item => (
        <div className={ clsx(style.document_item, { [style.viewed]: item.viewed }) } onClick={() => handleOnClick(item)}>
            <div className={ clsx(style.view_status) }>{ item.viewed ? 'Просмотрено' : 'Не просмотрено' }</div>
            <p className={ clsx(style.document_name) }>{ item.file.title }</p>
        </div>
    ))

    return (
        <div className={ clsx(style.documents) }>
            { content }
        </div>
    )
}