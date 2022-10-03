import cn from 'classnames';
import _get from 'lodash/get';
import { useRouter, withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { deeplinkActionRegister, checkIsMobileDeviceFast } from 'utils/common';
import DynamicLink from '../../../../../component/common/DynamicLink/DynamicLink';
import ImageOptimize from '../../../control/imageOptimize/imageOptimize';
import LanguageSwitch from '../../../control/languageSwitch';
import mobileDetectHOC from '../../../hocs/mobileDetect';
// import { useAuth } from '../../../provider/authBase';
import SideBar from './Desktop/SideBar/SideBar';
import MobilePopup from './Mobile/MobileDeepLink';
import { useSelector } from 'react-redux';

function NavBarMain(props) {
	const { commons } = useSelector((state) => state.commonReducer);
	// const auth = useAuth();
	const router = useRouter();
	const { t } = useTranslation('common');
	const { detectDevice, lang, isMobile } = props;
	const [extraClassNavTop] = useState('');
	const [search, setSearch] = useState({
		keyword: null,
	});
	const [showSidebar, toggleSidebar] = useState(false);

	const [dynamicMenuBar, setDynamicMenuBar] = useState([
		{
			id: 'personal',
			href: '/product?slug_type=personal',
			as: '/personal',
			transKey: 'landing.productHDBank.personal',
			active: false
		}
		,
		{
			id: 'corporate',
			href: '/product?slug_type=corporate',
			as: '/corporate',
			transKey: 'landing.productHDBank.coporate',
			active: false
		}
		,
		{
			id: 'priority',
			href: '/priority?customer_type=personal',
			as: '/personal/priority',
			transKey: 'landing.priorityProduct.title',
			active: false
		}
		,
		{
			id: 'investor',
			href: '/investor',
			as: '/investor',
			transKey: 'landing.investorProduct.title',
			active: false
		}
	]);

	useEffect(() => {
		// auth.checkToken();
		for (let idx = 0; idx < dynamicMenuBar.length; idx++) {
			let item = dynamicMenuBar[idx];
			if (window.location.pathname.includes('priority')) {
				if (item.id === 'priority')
					item.active = true
				else
					item.active = false
			}
			else if (window.location.pathname.includes(item?.as)) {
				item.active = true
			}
			else {
				item.active = false
			}
		}
		setTimeout(() => {
			setDynamicMenuBar([...dynamicMenuBar])
		}, 0);
		
	}, [router]);

	useEffect(() => {
		router.events.on('routeChangeStart', handleRouteChange);
		return () => {
			router.events.off('routeChangeStart', handleRouteChange);
		};
	}, []);

	const handleClick = () => {
		document.querySelector('#searchform').classList.toggle('active');
		if ($('#searchform').hasClass('active')) {
			$('.navbar-nav').css({ opacity: "0" });
		} else {
			$('.navbar-nav').css({ opacity: "1" })
		}
	}

	function handleRouteChange() {
		toggleSidebar(false);
	}

	const deepLinkAction = () => {
		if (props.isMobile) {
			if (detectDevice?.isMobileApp) {
				///mobile_login
				window.location = '/mobile_login';
			} else {
				//browser mobile view
				// window.location = 'https://hdbank.page.link/EwdR';
				if (lang === 'vi') window.location = 'https://ebanking.hdbank.vn/ipc/vi/';
				else window.location = 'https://ebanking.hdbank.vn/ipc/en/';
			}
		} else {
			if (lang === 'vi') window.location = 'https://ebanking.hdbank.vn/ipc/vi/';
			else window.location = 'https://ebanking.hdbank.vn/ipc/en/';
		}
	};

	const setKeyWord = (text = '') => {
		search.keyword = text;
		setSearch({ ...search });
	};

	function handleClickBurger(e) {
		toggleSidebar(!showSidebar);
	}

	function handleHideSidebar(e) {
		toggleSidebar(false);
	}

	return (
		<>
			{props.isMobile && <MobilePopup />}
			<div className={`nav-top ${extraClassNavTop}`}>
				<nav>
					<div className="container">
						<div className="nav-full d-flex align-center">
							<div className="btn btn-toggle" id="toggle" onClick={handleClickBurger}>
								<span className="btn-burger-icon"> </span>
								<span className="btn-burger-icon"> </span>
								<span className="btn-burger-icon"> </span>
								<span className="btn-burger-icon"></span>
								<span className="btn-burger-icon"></span>
							</div>

							<div
								className={cn('logo', {
									['nav-hidden']: !isMobile && showSidebar,
								})}
							>
								<DynamicLink href="/" as="/">
									<a>
										{
											commons?.data?.logoHD &&
											<ImageOptimize src={commons?.data?.logoHD} />
										}
									</a>
								</DynamicLink>
							</div>

							<ul className='navbar-nav'>
								{
									dynamicMenuBar?.map((item, index) => {
										return (
											<li class={item.active ? "nav-item active" : "nav-item"}>
												<DynamicLink
													href={item.href}
													as={item.as}
												>
													<a class="nav-link">{t(item.transKey)}</a>
												</DynamicLink>
											</li>
										)
									})
								}
							</ul>

							<div className="search-box" id="header-nav-top">
								<form className="searchform" id='searchform' action="" method="post">
									<div className="form-group">
										<input
											className="searchinput"
											type="text"
											id="inputSearch"
											name="inputSearch"
											placeholder={t('landing.common.searchplaceholder')}
											onChange={(e) => {
												const kw = e.target.value;
												setKeyWord(kw);
											}}
										/>
										<div className='close' onClick={() => {
											let searchForm = $('#searchform');
											searchForm.removeClass('active');
											let inputSearch = $('#inputSearch');
											inputSearch.val('');
											setKeyWord(null);
											$('.navbar-nav').css({ opacity: "1" })
										}}>
											<img src='/asset/images/icons/close.png' alt='close'></img>
										</div>
										<DynamicLink href={`/search?keyword=${search.keyword}`} as={`/search?keyword=${search.keyword}`}>
											<button
												disabled={search.keyword === null || search.keyword === ''}
											>
												<ImageOptimize src="/asset/images/icons/search.png" alt="" />
											</button>
										</DynamicLink>
									</div>
								</form>
								<div className='searchIcon' onClick={handleClick}>
									<ImageOptimize src="/asset/images/icons/search.png" alt="" />
								</div>
							</div>
							{/* //Login AREA */}
							{
								// auth.ebankLogged?.logged || 
								(
									<>
										{
											detectDevice?.isMobileApp ?
												<>
													<button className="register" onClick={() => deeplinkActionRegister(props.isMobile, detectDevice?.isMobileApp)}>
														<p>{t('landing.sidebar.register')}</p>
													</button>
													<button className="login" onClick={() => deepLinkAction()} type="submit">
														<p>{t('landing.common.login')}</p>
													</button>
												</>
												:
												<>
													<button className="register" onClick={() => deepLinkAction()} type="submit">
														<p>{t('landing.common.login')}</p>
													</button>
													<button className="login" onClick={() => deeplinkActionRegister(props.isMobile, detectDevice?.isMobileApp)}>
														<p>{t('landing.sidebar.register')}</p>
													</button>
												</>
										}
									</>
								)}
							{/* /**END LOGIN */}
							{
								checkIsMobileDeviceFast() ||
								<LanguageSwitch />
							}
							{
								// detectDevice?.isMobileApp 
								checkIsMobileDeviceFast() && (
									<a className="bell-ring" href="/mobile_notification">
										<ImageOptimize src="/asset/images/icons/bell.png" alt="" />
									</a>
								)}
						</div>
					</div>
				</nav>
				<SideBar setKeyWord={setKeyWord} search={search} onClickOutside={handleHideSidebar} showSidebar={showSidebar} />
			</div>
		</>
	);
}

NavBarMain.propTypes = {};

NavBarMain.defaultProps = {};

const mapStateToProps = (state) => {
	return {
		commons: state.commonReducer.commons,
		detectDevice: state.app.detectDevice,
		lang: state.app.language,
	};
};
export default withRouter(connect(mapStateToProps)(mobileDetectHOC(NavBarMain)));
