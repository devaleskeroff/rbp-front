import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
// COMPONENTS
import { ErrorIndicator, Loader } from '@ui/indicators'
import { useModal } from '@modals/index'
import SignatureLogTable from '@components/tables/unit-tables/signature-log-table'
// SERVICE
import UnitService from '@services/unit-service'
// TYPES
import { DocumentSignatureHistoryT } from '@interfaces/company/units'
// STYLES
import style from '@scss/pages/signing-documents.module.scss'

const SignatureLogModal = () => {
    const [signatures, setSignatures] = useState<Array<DocumentSignatureHistoryT>>([])
    const [states, setStates] = useState({
        isPending: true,
        error: false
    })
    const { modalData, modalComponent } = useModal()

    useEffect(() => {
        const currentModal = document.querySelector('.' + clsx(style.sending_for_signature_modal)) as HTMLDivElement
        const reactSliderDiv = currentModal.closest('.react-responsive-modal-modal')

        if (reactSliderDiv) {
            reactSliderDiv.classList.add(clsx(style.large_modal))
        }
        UnitService.GetSignatureHistories(modalData.unitId, modalData.document.id, (err, res) => {
            if (err || !res) {
                return setStates({ isPending: false, error: true })
            }
            setSignatures(res.data)
            setStates({ isPending: false, error: false })
        })
    }, [])

    return (
        <div key={ modalComponent.key } className={ clsx(style.sending_for_signature_modal) }>
            <p className="modal_title">Журнал подписаний "{ modalData.document.title }"</p>
            <div className="underline"/>
            <div className={ `modal_content ${ style.adding_doc_modal_content }` }>
                {/* DOCUMENTS TABLE */ }
                {
                    states.error ? <ErrorIndicator /> : states.isPending ? <Loader /> :
                        <SignatureLogTable signatures={signatures} />
                }
            </div>
        </div>
    )
}

export default SignatureLogModal