import React, { useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { BreadCrumb, TableTopPanel } from '@components/common'
import { ColorfulButton, Title } from '@components/common/common'
import { ResponsibilityTable } from '@components/tables'
// STORE
import { $UserRole, UserRoleEnum } from '@store/user-store'
import { $ResponsibilityDocuments } from '@store/responsibility-store'
// STYLES
import style from '@scss/pages/responsibility.module.scss'

export enum ResponsibilityRequestTypeEnum {
    RESPONSIBILITY = 'RESPONSIBILITY',
    LEGAL_INFORMATION = 'LEGAL_INFORMATION'
}

const Responsibility = () => {
    const userRole = useStore($UserRole)
    const currentDocuments = useStore($ResponsibilityDocuments)
    const [withHistory, setWithHistory] = useState<boolean>(false)
    const [sortOption, setSortOption] = useState<number>(0)

    const { open } = useModal()

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Ответственность'] }/>
                    <Title text='Ответственность' withHistory={ withHistory } />
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
                                <ColorfulButton text={'Загрузить документы'} onClick={() => open('UploadResponsibilityModal', {
                                    modalData: {
                                        type: ResponsibilityRequestTypeEnum.RESPONSIBILITY
                                    }
                                })} />
                                <ColorfulButton text={'Создать папку'} plusIcon={false} onClick={() => open('CreateFolderModal', {
                                    modalData: { modalTitle: 'Создать папку', responsibilityMode: true },
                                    btnText: 'Создать'
                                })} />
                            </div>
                    }
                    {/* TABLE */}
                    <ResponsibilityTable setWithHistory={setWithHistory} sort={sortOption} />
                </div>
            </div>
        </main>
    )
}

export default Responsibility