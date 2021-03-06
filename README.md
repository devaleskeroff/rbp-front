# Документация по клиентской части проекта RBP

## `Пути компонентов верстки`
- Все компоненты для страниц находятся в `src/components`
- Таблицы - `src/components/tables`
- Модальные окна - `src/modals`
- Страницы - `src/pages`
- Стили - `src/scss`
- Сервисы(запросы) - `src/services`
- Store(состояния) - `src/store`
- Типы - `src/types`
- Вспомогательные инструменты - `src/utils`
- Прочие ui компоненты - `src/ui`
- Часть изображений(которые импортируются в приложении) и иконок находится в
`src/assets` и часть в `public`

## `Общий принцип работы клиентской части`
### Запросы
- Все запросы отправляются в `services`.
- Валидация введенных данных происходит на обеих частях(front-end и back-end) и валидация
абсолютно одинаковая в обеих местах т.е ошибки валидации в одинаковом формате получаются и
таким образом часто на клиенте при получении `422` статуса в теле ответа расположены результаты
валидации, которые устанавливаются в useState и отображаются на странице.

### Переиспользование компонентов
- В основном все те компоненты, которые предназначены для дальнейшего переиспользования получают
`общие классы` без использования `clsx`.
- **Исключение: таблицы, у которых свои модульные стили.**
- **Примечание: некоторые модульные стили тоже переиспользуются!**

### Модальные окна
Модальное окно используется из библиотеки `react-responsive-modals`.
Для модальных окон реализован специальный `modal-hook`, который позволяет в параметрах
передавать компонент(который будет рендерится в модальном окне).
Для открытия модального окна вызывается функция `open("ModalName", options)`.
Чтобы добавить новое модальное окно, потребуется после создания компонента его зарегистрировать
в `modal-store` импортировав его и указав в объекте `ModalsList`, а также добавить
название модалки (которое было указано в качестве ключа в объекте `ModalsList`) в `ModalItemEnum`
как возможный параметр при вызове функции `open`. Функция `open` вторым параметров принимает
опции. В опциях указывается `btnText`, который потом можно будет получить из объекта
`modalComponent` который в свою очередь излеваекается из объекта при вызове хука `useModal()`.
Также в `modalData` добавляет объект, который потом можно будет получать в компоненте модального окна.
Закрыть можно вызвая функцию `close` из `useModal`.