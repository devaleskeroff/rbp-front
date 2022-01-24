// GET запрос

// ТИП USER

// export type FilesT = {
//     basename: string // Полное имя файла с расширением name.pdf
//     id: number //ID дока
//     dirname: string// Папка
//     extension: string // Расширение pdf, xls, docx и тд
//     filename: string //Название файла name
//     path: string // Путь url
//     size: number // Размер
//     timestamp: number // Дата создания в unix формате(в секундах)
// }


// Тип DATA
export type FeedbackT = {
    id: number
    title: string
    description: string
    userName: string
    companyName: string
    answer: string | null
    answeredAt: number | null
    files: Array<{
        name: string
        size: number
        path: string
    }>
    createdAt: number
}

export type FetchingFeedbackDataT = {
    success: boolean
    data: FeedbackT
}

// POST запрос на вопрос

export type QuestionPostRequestT = {
    title: string
    question: string
    files: Blob[] //Blob тип для отправки данных в  целом здесь не принципиально какой использовать хоть any главное отдать файлы
}
