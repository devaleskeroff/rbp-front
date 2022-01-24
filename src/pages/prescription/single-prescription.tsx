import React from 'react'
import { useStore } from 'effector-react'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import { Title } from '@components/common/common'
import { PrescriptionItems } from '@components/prescriptions'
// STORE
import { $SelectedPrescription } from '@store/prescription-store'

const SinglePrescription = () => {
    const prescription = useStore($SelectedPrescription)

    if (!prescription) {
        return null;
    }
    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Предписания', 'Предписание'] }/>
                    <Title text="Предписание" withHistory />
                </div>
                <PrescriptionItems item={[ prescription ]} singleMode />
            </div>
        </main>
    )
}

export default SinglePrescription