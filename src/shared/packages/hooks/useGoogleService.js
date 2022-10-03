import React, { useEffect, useState } from "react";
import Geocode from "react-geocode";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { getWebSuggest } from "services/hdbankService/network";

export function useGoogleService(props) {
    //props state
    const { t } = useTranslation('common');
    const { language } = useSelector((state) => state.app);
    const { commons, commonHDBank } = useSelector((state) => state.commonReducer);
    const keySession = "is-close-website-suggest";
    const keySessionData = "website-suggest-data";
    const [location, setLocation] = useState({
        isClose: true,
        data: null,
        convertData: null
    })

    const clearLocation = () => {
        location.isClose = false;
        location.data = null;
        setLocation({ ...location })
    }

    const initLocation = () => {
        Geocode.setApiKey(
            commonHDBank?.data?.social?.googleMap
        );
        Geocode.setLanguage("vi");
        Geocode.setRegion("vn");

        navigator.geolocation.getCurrentPosition((data) => {
            if (data) {
                Geocode.fromLatLng(
                    data?.coords?.latitude,
                    data?.coords?.longitude
                )?.then(
                    (response) => {
                        //  console.log({ response });
                        if (response.results && response.results?.length > 0) {
                            location.isClose = false;
                            location.data = response.results[0];
                            sessionStorage.setItem(keySessionData, JSON.stringify(response.results[0]))
                            setLocation({ ...location })
                        }
                        else {
                            clearLocation()
                        }
                    },
                    (error) => {
                        clearLocation()
                        console.error(error);
                    });
            }
        }, () => {
            clearLocation()
        });
    }
    //hook
    useEffect(() => {
        if (commonHDBank?.data) {
            const getCurrentStateSession = sessionStorage.getItem(keySession);
            if (getCurrentStateSession === "true") {
                location.isClose = true;
                location.data = null;
                setLocation({ ...location })
                return;
            }
            else {
                sessionStorage.setItem(keySession, false)
                if (sessionStorage.getItem(keySessionData) === null) {
                    initLocation();
                }
                else {
                    const data = JSON.parse(sessionStorage.getItem(keySessionData) ?? {})
                    location.isClose = false;
                    location.data = data;
                    setLocation({ ...location })
                }

                // navigator?.permissions?.query({ name: 'geolocation' }).then((permission) => {
                //     //check permission
                //     if (permission.state === "denied") {
                //         clearLocation();
                //     }
                //     if (permission.state === "prompt") {
                //         initLocation()
                //     }
                //     if (permission.state === "granted") {
                //         if (getCurrentStateSession === "false" || getCurrentStateSession === null) {
                //             sessionStorage.setItem(keySession, false)
                //             if (sessionStorage.getItem(keySessionData) === null) {
                //                 initLocation();
                //             }
                //             else {
                //                 const data = JSON.parse(sessionStorage.getItem(keySessionData) ?? {})
                //                 location.isClose = false;
                //                 location.data = data;
                //                 setLocation({ ...location })
                //             }
                //         }
                //     }
                // });
            }
        }
    }, [commonHDBank])

    useEffect(() => {
        if (commons?.data?.locationPostsUrl)
            scriptTextPattern(location.data);
    }, [location.data, commons?.data?.locationPostsUrl])

    //func
    const scriptTextPattern = (data) => {
        let pattern = {
            scriptText: null,
            buttonCTA: {
                url: null,
                text: null
            }
        }
        let provice = {
            provinceName: t('goiywebsite.default-province-2'),
            url: commons?.data?.locationPostsUrl,
            urlText: t('goiywebsite.default-province-1')
        }
        //preparing data
        if (data !== null) {
            const extract = data?.address_components?.filter(x =>
                x.types?.some(r => ["administrative_area_level_1", "administrative_area_level_2", "locality"].includes(r))
            );
            const city = extract[0]?.long_name;
            const province = extract[1]?.long_name;
            getWebSuggest(language, {
                provinceName: province,
                districtName: city
            }).then((res) => {
                const resdata = res?.data;
                if (res?.data?.website) {
                    provice.provinceName = "website " + resdata?.websiteLocation;
                    provice.url = resdata?.website;
                    provice.urlText = resdata?.website?.replace('https://', '')?.replace('www.', '');

                    pattern.scriptText = `${t('goiywebsite.first-text')} <b>${provice.provinceName}</b> ${t('goiywebsite.second-text')}`
                    pattern.buttonCTA.url = provice.url;
                    pattern.buttonCTA.text = provice.urlText;

                    location.convertData = pattern;
                    setLocation({ ...location })
                }
            })
        }
        pattern.scriptText = `${t('goiywebsite.first-text')} ${provice.provinceName} ${t('goiywebsite.second-text')}`
        pattern.buttonCTA.url = provice.url;
        pattern.buttonCTA.text = provice.urlText;
        location.convertData = pattern;
        setLocation({ ...location })
    }

    const closeSession = () => {
        sessionStorage.setItem(keySession, true);
        location.isClose = true;
        location.data = null;
        setLocation({ ...location })
    }

    return {
        location: location,
        closeSession: closeSession
    };
}
