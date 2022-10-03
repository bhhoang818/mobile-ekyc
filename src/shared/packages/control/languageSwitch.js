import React, { useEffect, useState } from 'react';
import { masterConfig } from "../../../config/master"
import { useTranslation } from "react-i18next";
import { updateLanguage } from "../../../redux/actions/appActions";
import { useDispatch, useSelector } from "react-redux";
import ImageOptimize from "../control/imageOptimize/imageOptimize"
import { useRouter } from "next/router";

function LanguageSwitch(props) {
    const { i18n } = useTranslation()
    const { language, detectDevice } = useSelector((state) => state.app);
    const dispatch = useDispatch();
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    useEffect(() => {
        $('.dropdown-toggle').on('click', () => {
            $('.dropdown .dropdown-menu').slideToggle()
        })
    }, [])

    useEffect(() => {
        const { lang } = router.query;
        const langCache = lang ?? localStorage.getItem("lang");
        if (langCache && ['vi', 'jp', 'en'].includes(langCache)) {
            const valueLanguage = langCache;
            i18n.changeLanguage(valueLanguage);
            dispatch(updateLanguage(valueLanguage));
        }
    }, [router?.query?.lang])

    useEffect(() => {
        setSelectedLanguage(language);
    }, [language])

    useEffect(() => {
        if (detectDevice?.isMobileApp || detectDevice?.lang) {
            const valueLanguage = detectDevice?.lang ?? "vi";
            i18n.changeLanguage(valueLanguage);
            dispatch(updateLanguage(valueLanguage));
        }
    }, [detectDevice])

    const handleClose = (lan) => {
        const valueLanguage = lan?.eventCode ?? 'vi';
        i18n.changeLanguage(valueLanguage);
        dispatch(updateLanguage(valueLanguage));

        let arrUrl = router.asPath.split('/');
        if (arrUrl?.length > 0) {
            if (['vi', 'en', 'jp'].includes(arrUrl[1])) {
                arrUrl[1] = lan?.eventCode;
                window.history.pushState(null, "", arrUrl.join("/"));
            }
            else {
                if (arrUrl[1] === "") {
                    arrUrl[1] = lan?.eventCode;
                    window.history.pushState(null, "", arrUrl.join("/"));
                }
            }
        }
        $(".dropdown-toggle").click();
    };

    const renderBaseCountryFlag = (code) => {
        switch (code) {
            case 'vi': return "/asset/images/icons/vn.png"
            case 'en': return "/asset/images/icons/en.png"
            case 'jp': return "/asset/images/icons/jp.png"
            default: return "/asset/images/icons/vn.png"
        }
    }

    return (
        <div className="dropdown">
            <button className="btn dropdown-toggle">
                <ImageOptimize src={renderBaseCountryFlag(selectedLanguage)} alt="" />
            </button>
            <ul className="dropdown-menu">
                {
                    masterConfig?.language?.filter(x => x.code !== selectedLanguage)?.map((lan, index) => {
                        return (
                            <li key={index} className="dropdown-item" onClick={() => handleClose(lan)}>
                                <div className='flag'>
                                    <ImageOptimize src={renderBaseCountryFlag(lan?.code)} alt="" />
                                    <span>{lan?.text}</span>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

LanguageSwitch.propTypes = {
};

LanguageSwitch.defaultProps = {
};

export default LanguageSwitch;
