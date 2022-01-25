import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
// COMPONENTS
import Slider from 'react-slick'
import { settings } from '@components/home'
import { Title } from '@components/common/common'
import NewsItems from '@components/news-components'
import EventItems from '@components/events'
import { Loader, ErrorIndicator } from '@ui/indicators'
// HOOKS
import useModal from '@modals/modal-hook'
// STORE
import { useStore } from 'effector-react'
import { $HomeData, fetchHomeData, setBannersImages } from '@store/home-store'
import { $User, $UserDataStates, UserRoleEnum } from '@store/user-store'
import { $News, $NewsStates, fetchNews } from '@store/news/news-store'
import { $Company, switchCompany } from '@store/company/company-store'
// SERVICE
import BannersService from '@services/banners-service';
// TYPES
import { UserDataT } from '@interfaces/user'
import { CompanyT } from '@interfaces/company/company'
// STYLE
import 'slick-carousel/slick/slick.css'
import style from '@scss/pages/home.module.scss'
import baseTable from '@scss/components/tables/base-table.module.scss'

export enum BannersImagesEnum {
    Banner = 'BANNER', 
    Slide = 'SLIDE', 
    AddSlide = 'ADD_SLIDE', 
    DeleteSlide = 'DELETE_SLIDE'
}

const Home = () => {
    const user = useStore($User) as UserDataT
    const { isLoading, error } = useStore($UserDataStates)
    const selectedCompany = useStore($Company) as CompanyT
    const { notifications, banners, slides, isFetched } = useStore($HomeData)
    const news = useStore($News)
    const { isLoading: newsPending, isFetched: newsFetched, error: newsError } = useStore($NewsStates)

    const { open } = useModal();

    useEffect(() => {
        if (!isFetched) {
            fetchHomeData()
        }
        if (!newsFetched) {
            fetchNews({
                skip: 0,
                limit: 9,
                count: true
            })
        }
    }, [selectedCompany])

    const handleChangeSelectedCompany = (id: number) => {
        switchCompany({ id })
    }

    const onBannerClick = (type: BannersImagesEnum, index: number) => {
        if (type === BannersImagesEnum.DeleteSlide) {
            return open('ConfirmActionModal', {
                modalData: {
                    text: 'Вы уверены, что хотите удалить выбранный слайд?'
                },
                btnText: 'Удалить',
                onConfirm: () => {
                    BannersService.DeleteSlide(index, (err, res) => {
                        if (err || !res) {
                            return console.log('При удалении слайда произошла неожиданная ошибка')
                        }
                        setBannersImages({
                            banners: banners!,
                            slides: slides?.filter((_, idx) => idx !== index) || [],
                        })
                    })
                }
            })
        }

        open('UploadBannerModal', {
            modalData: {
                slides: type !== BannersImagesEnum.Banner ? slides : null,
                type,
                index,
            }
        })
    }

    return (
        <main className="content-container">
            <div className="content-section">
                <div className="top-content">
                    <Title text="Главная страница" />
                </div>
                <div className={ clsx(style.home_content) }>
                    {/* TOP BLOCKS (FIRST 3) */ }
                    <div className={ clsx(style.top_blocks) }>
                        {/* FIRST (USER) BLOCK */ }
                        { isLoading ? <Loader /> : error ? <ErrorIndicator /> :
                            <div className={ clsx(style.user_block) }>
                                <div className={ clsx(style.user_info_block) }>
                                    <img src={ process.env.API_URL + user.avatar } alt=""
                                         className={ clsx(style.user_img) } />
                                    <p className={ clsx(style.user_info_txt) }>{ user.name }</p>
                                    <p className={ clsx(style.user_info_txt) }>{ user.roleName }</p>
                                    <div className={ clsx(style.user_companies_select) }>
                                        <button className={ clsx(style.user_companies_selected) }>
                                            { selectedCompany.name }
                                            <img src="/img/static/white-arrow_drop.png" alt="" />
                                        </button>
                                        <div className={ clsx(style.user_companies_list) }>
                                            {
                                                user.companies
                                                    .filter(company => company.id !== selectedCompany.id)
                                                    .map(company => (
                                                        <button key={ company.id }
                                                                onClick={ () => handleChangeSelectedCompany(company.id) }
                                                                className={ clsx(style.user_companies_list_item) }>
                                                            { company.name }
                                                        </button>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* SECOND (TARIFF) BLOCK */ }
                        <div className={ clsx(style.second_block) }>
                            <div className={ clsx(style.tariff_block) }>
                                <p className={ clsx(style.tariff_subtitle) }>Ваш тариф:</p>
                                <p className={ clsx(style.tariff_name) }>Premium</p>
                                <p className={ clsx(style.tariff_subtitle) }>У вас осталось: 3 месяца</p>
                                <Link className={ clsx(style.tariff_extension_btn) } to={ '/' }>Продлить</Link>
                            </div>
                            <div className={ clsx(style.spacer) } />
                            <div className={ clsx(style.test_block) }>
                                <img src="/img/static/vision-zero-logo.jpg" alt="" />
                                <p className={ clsx(style.test_block_title) }>
                                    Семь «золотых правил» производства
                                </p>
                                <p className={ clsx(style.test_subtitle) }>
                                    С нулевым травматизмоми с безопасными условиями труда
                                </p>
                                <button className={`green-colorful-btn ${ clsx(style.start_test_btn) }`}>
                                    Начать тестирование
                                </button>
                            </div>
                        </div>
                        {/* THIRD (PROMPTS) BLOCK */ }
                        <div className={ clsx(style.prompts_block) }>
                            <p className={ clsx(style.prompts_title) }>
                                Как отправить документы на ознакомление и подписание?
                            </p>
                            <div className={ clsx(style.underline) } />
                            <div className={ clsx(style.prompts_list) }>
                                <div key={ 'chck1' } className="flex-n-c mt-12">
                                    <input type="checkbox" className={ clsx(baseTable.checkbox_item) } hidden
                                           name="" id={ 'chck1' } defaultChecked />
                                    <label htmlFor={ 'chck1' }>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>
                                    <label htmlFor={ 'chck1' }
                                           className={ `ml-10 ${ clsx(style.checkbox_label) }` }>
                                        Создайте группу документов
                                    </label>
                                </div>
                                <div key={ 'chck2' } className="flex-n-c mt-12">
                                    <input type="checkbox" className={ clsx(baseTable.checkbox_item) } hidden
                                           name="" id={ 'chck2' } defaultChecked />
                                    <label htmlFor={ 'chck2' }>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>
                                    <label htmlFor={ 'chck2' }
                                           className={ `ml-10 ${ clsx(style.checkbox_label) }` }>
                                        Загрузите документы
                                    </label>
                                </div>
                                <div key={ 'chck3' } className="flex-n-c mt-12">
                                    <input type="checkbox" className={ clsx(baseTable.checkbox_item) } hidden
                                           name="" id={ 'chck3' } />
                                    <label htmlFor={ 'chck3' }>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>
                                    <label htmlFor={ 'chck3' }
                                           className={ `ml-10 ${ clsx(style.checkbox_label) }` }>
                                        Получите утверждение
                                    </label>
                                </div>
                                <div key={ 'chck4' } className="flex-n-c mt-12">
                                    <input type="checkbox" className={ clsx(baseTable.checkbox_item) } hidden
                                           name="" id={ 'chck4' } />
                                    <label htmlFor={ 'chck4' }>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>
                                    <label htmlFor={ 'chck4' }
                                           className={ `ml-10 ${ clsx(style.checkbox_label) }` }>
                                        Создайте подразделение
                                    </label>
                                </div>
                                <div key={ 'chck5' } className="flex-n-c mt-12">
                                    <input type="checkbox" className={ clsx(baseTable.checkbox_item) } hidden
                                           name="" id={ 'chck5' } />
                                    <label htmlFor={ 'chck5' }>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>
                                    <label htmlFor={ 'chck5' }
                                           className={ `ml-10 ${ clsx(style.checkbox_label) }` }>
                                        Создайте должность
                                    </label>
                                </div>
                                <div key={ 'chck6' } className="flex-n-c mt-12">
                                    <input type="checkbox" className={ clsx(baseTable.checkbox_item) } hidden
                                           name="" id={ 'chck6' } />
                                    <label htmlFor={ 'chck6' }>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>
                                    <label htmlFor={ 'chck6' }
                                           className={ `ml-10 ${ clsx(style.checkbox_label) }` }>
                                        Добавьте сотрудников
                                    </label>
                                </div>
                                <div key={ 'chck7' } className="flex-n-c mt-12">
                                    <input type="checkbox" className={ clsx(baseTable.checkbox_item) } hidden
                                           name="" id={ 'chck7' } />
                                    <label htmlFor={ 'chck7' }>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>
                                    <label htmlFor={ 'chck7' }
                                           className={ `ml-10 ${ clsx(style.checkbox_label) }` }>
                                        Отправьте документы на подписание
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* NOTIFICATIONS */ }
                        {
                            notifications === null ? <Loader /> : notifications === false ? <ErrorIndicator /> :
                                notifications.length < 3 ? null :
                                    <div className={ clsx(style.notifications) }>
                                        <p className={ clsx(style.block_title) }>
                                            Оповещения <Link to={ '/notifications' }>Все оповещения</Link>
                                        </p>
                                        <EventItems events={ notifications } limit={ 3 }/>
                                    </div>
                        }
                    {/* SALES AND OFFERS BLOCKS */ }
                    <div className={ clsx(style.sales_and_offers_blocks) }>
                        {/* SLIDER */ }
                        <div className={ clsx(style.home_slider_section) }>
                            <p className={ clsx(style.block_title) }>Акции и предложения</p>
                            {
                                slides != null ?
                                    <Slider { ...settings }>
                                        {
                                            slides.map((src, idx) => {
                                                return <Link to={ '/' } key={ idx }>
                                                    <div className={ clsx(style.home_slider_item, { [style.editable]: user.role === UserRoleEnum.SuperAdmin }) }>
                                                        <div className={ clsx(style.actions) }>
                                                        <div onClick={ () => onBannerClick(BannersImagesEnum.Slide, idx) }>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div onClick={ () => onBannerClick(BannersImagesEnum.AddSlide, idx) }>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div onClick={ () => onBannerClick(BannersImagesEnum.DeleteSlide, idx) }>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </div>
                                                        </div>
                                                        {/* TODO REMOVE BACKEND URL LATER */}
                                                        <img src={process.env.API_URL + src} alt="" className={ clsx(style.home_slider_img) } />
                                                    </div>
                                                </Link>
                                            })
                                        }
                                    </Slider> : null
                            }
                        </div>
                        {/* SALES AND OFFERS ITEMS */ }
                        {
                            banners != null ? 
                            <>
                                {
                                    banners.map((src, idx) => (
                                        <div key={ idx } className={ clsx(style.sales_and_offers_item, { [style.editable]: user.role === UserRoleEnum.SuperAdmin }) }>
                                            <div className={ clsx(style.edit_btn) } 
                                                onClick={ () => onBannerClick(BannersImagesEnum.Banner, idx) }>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            {/* TODO REMOVE BACKEND URL LATER */}
                                            <img src={process.env.API_URL + src} alt=""
                                                className={ clsx(style.home_slider_img, style.home_banner_img) } />
                                        </div>
                                    ))
                                } 
                            </> : null
                        }
                    </div>
                    {/* NEWS */ }
                    <div className={ clsx(style.news) }>
                        <p className={ clsx(style.block_title) }>
                            Новости
                            <Link to={ '/news' }>Все новости</Link>
                        </p>
                        {
                            newsPending ? <Loader /> : newsError ? <ErrorIndicator /> :
                                <NewsItems items={ news } path={ 'news' } limit={4} />
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Home