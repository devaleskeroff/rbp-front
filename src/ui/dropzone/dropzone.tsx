import React, { useEffect } from 'react'
import clsx from 'clsx'
// COMPONENTS
import { useDropzone } from 'react-dropzone'
// STYLES
import style from './dropzone.module.scss'

type DropzonePropsT = {
    maxFiles?: number
    requiredFiles?: number
    accept?: string
    onUpload: (files: File[]) => void
}

function Dropzone({ maxFiles, requiredFiles, accept, onUpload }: DropzonePropsT) {
    const options = {} as { [key: string]: any }

    if (maxFiles) {
        options.maxFiles = maxFiles
    }

    if (accept) {
        options.accept = accept
    }

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone(options)

    const files = acceptedFiles.map((file: any) => (
        <li key={ file.path }>
            { file.path } - { file.size } bytes
        </li>
    ))

    useEffect(() => {
        onUpload(acceptedFiles)
    }, [acceptedFiles])

    return (
        <>
            <section className={ clsx(style.dropzone_container) }>
                 <div { ...getRootProps({ className: clsx(style.dropzone) }) }>
                    <div>
                        <input { ...getInputProps() } />
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.5 10C0.776142 10 1 10.2239 1 10.5V13.8333C1 14.1428 1.12292 14.4395 1.34171 14.6583C1.5605 14.8771 1.85725 15 2.16667 15H13.8333C14.1428 15 14.4395 14.8771 14.6583 14.6583C14.8771 14.4395 15 14.1428 15 13.8333V10.5C15 10.2239 15.2239 10 15.5 10C15.7761 10 16 10.2239 16 10.5V13.8333C16 14.408 15.7717 14.9591 15.3654 15.3654C14.9591 15.7717 14.408 16 13.8333 16H2.16667C1.59203 16 1.04093 15.7717 0.634602 15.3654C0.228273 14.9591 0 14.408 0 13.8333V10.5C0 10.2239 0.223858 10 0.5 10Z" fill="#373737"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.47976 5.97979C3.67502 5.78453 3.9916 5.78453 4.18686 5.97979L7.99998 9.7929L11.8131 5.97979C12.0084 5.78453 12.3249 5.78453 12.5202 5.97979C12.7155 6.17505 12.7155 6.49163 12.5202 6.6869L8.35353 10.8536C8.15827 11.0488 7.84169 11.0488 7.64642 10.8536L3.47976 6.6869C3.28449 6.49163 3.28449 6.17505 3.47976 5.97979Z" fill="#373737"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M8 0C8.27614 0 8.5 0.223858 8.5 0.5V10.5C8.5 10.7761 8.27614 11 8 11C7.72386 11 7.5 10.7761 7.5 10.5V0.5C7.5 0.223858 7.72386 0 8 0Z" fill="#373737"/>
                        </svg>
                        <p>Для загрузки нажмите сюда<br />Или перетащите файл</p>
                    </div>
                </div>
            </section>
            <aside>
                <p className={ clsx(style.uploaded_text) }>Загружено файлов: { acceptedFiles.length }
                    { requiredFiles ? ' из ' + requiredFiles : null }
                </p>
                {
                    // !requiredFiles && maxFiles ? <p className={ clsx(style.uploaded_text) }>Максимум файлов: { maxFiles }</p> : null
                    maxFiles ? <p className={ clsx(style.uploaded_text) }>Максимум файлов: { maxFiles }</p> : null
                }
            </aside>
        </>
    )
}

export default Dropzone