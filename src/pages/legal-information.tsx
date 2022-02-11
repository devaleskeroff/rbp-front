import React, { useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { BreadCrumb, TableTopPanel } from '@components/common'
import { ColorfulButton, Title } from '@components/common/common'
import LegalInformationTable from '@components/tables/legal-information-tables'
// STORE
import { $UserRole, UserRoleEnum } from '@store/user-store'
import { $LegalInformationDocuments } from '@store/legal-information-store'
// TYPES
import { ResponsibilityRequestTypeEnum } from '@pages/responsibility'
// STYLES
import style from '@scss/pages/responsibility.module.scss'

const LegalInformation = () => {
    const userRole = useStore($UserRole)
    const currentDocuments = useStore($LegalInformationDocuments)
    const [withHistory, setWithHistory] = useState<boolean>(false)
    const [sortOption, setSortOption] = useState<number>(0)

    const { open } = useModal()

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Юридическая информация'] }/>
                    <Title text='Юридическая информация' withHistory={ withHistory } />
                </div>
                <div className="mt-50 bg-white rounded-md">
                    {/* TABLE TOP PANEL */}
                    <TableTopPanel text={`Папок: ${currentDocuments[1].length} Файлов: ${currentDocuments[0].length}`}
                                   hideSearchPanel onSelectOption={option => setSortOption(option.value)} />
                </div>
                <div className="bg-white mt-25">
                    {/* CREATION BUTTONS */}
                    {
                        userRole !== UserRoleEnum.SuperAdmin ? null :
                            <div className={ clsx(style.creation_buttons) }>
                                <ColorfulButton text={'Загрузить документы'} onClick={() => open('UploadLegalInformationModal')} />
                                <ColorfulButton text={'Создать папку'} plusIcon={false} onClick={() => open('CreateLegalInfoFolderModal', {
                                    modalData: { modalTitle: 'Создать папку' },
                                    btnText: 'Создать'
                                })} />
                            </div>
                    }
                    {/* TABLE */}
                    <LegalInformationTable setWithHistory={setWithHistory} sort={sortOption} />
                </div>
            </div>
        </main>
    )
}

export default LegalInformation