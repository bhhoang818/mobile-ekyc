import React, { useEffect, useState } from "react";
import NavBarLandingPage from "shared/packages/layout/nav/landing_page/nav_main"
import FooterComponent from "../../../component/landing/subcomponent/footer/footer"
import SupportComponent from "../../../component/landing/subcomponent/support/support"
import PopupNotification from 'component/PopupNotification';
import { useRouter } from 'next/router';
import { useGoogleService } from "../../../shared/packages/hooks/useGoogleService"

const CommonLayout = ({ children }) => {
	const router = useRouter()
	const [pathKey, setPathKey] = useState(null);
	const googleService = useGoogleService();

	function scroll() {
		try {
			if (window.pageYOffset > 0 && $(window).width() > 992) {
				document.querySelector(".nav-top")?.classList?.add("header-croll-down");
			} else {
				document.querySelector(".nav-top")?.classList?.remove("header-croll-down");
			}
		}
		catch { }
	}
	useEffect(() => {
		window.addEventListener("scroll", scroll, false);
		return (() => {
			window.removeEventListener('scroll', scroll, false);
		})
	}, [children])

	useEffect(() => {
		const pathProps = router.asPath;
		if (pathProps) {
			const parsing = pathProps?.replace('/vi', '').replace('/en', '').replace('/jp', '')
			if (parsing === '') {
				setPathKey(null)
			}
			else {
				setPathKey(parsing?.substring(1))
			}
		}
	}, [router.asPath])

	return (
		<React.Fragment>
			<NavBarLandingPage />
			<div id="root-content" className="app-content content">
				<main>
					{children}
				</main>
				<SupportComponent googleService={googleService} />
				<FooterComponent />
				<PopupNotification pathKey={pathKey} />
			</div>
		</React.Fragment>
	);
}
//for landing page
export default CommonLayout;
//for webapp
//export default withAuth(CommonLayout);
