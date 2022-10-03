import { useEffect, useState } from "react";

function withMobileDetect({
    WrappedComponent
}) {
    const WithMobileDetectWrapper = props => {
        const [isMobile, setIsMobile] = useState({
            isMobile: null
        });
        const [screenDetectSize, setScreenDetectSize] = useState({
            screenSize: null
        })

        useEffect(() => {
            updateWindowDimensions();
          //  checkUserAgent();
            window.addEventListener("resize", updateWindowDimensions);

            return () => {
                window.removeEventListener("resize", updateWindowDimensions);
            }
        }, [])

        const updateWindowDimensions = () => {
            setScreenDetectSize({
                screenSize: window.innerWidth
            });

            if (window.innerWidth < 769) {
                setIsMobile({
                    isMobile: true
                });
            } else {
                setIsMobile({
                    isMobile: false
                });
            }
        };

        // const checkUserAgent = () => {
        //     var standalone = window.navigator.standalone,
        //         userAgent = window.navigator.userAgent.toLowerCase(),
        //         safari = /safari/.test(userAgent),
        //         ios = /iphone|ipod|ipad/.test(userAgent);

        //     if (ios) {
        //         if (!standalone && safari) {
        //             // Safari
        //             setWebViewDetect({
        //                 android: {
        //                     webview: false,
        //                     appview: false
        //                 },
        //                 ios: {
        //                     webview: true,
        //                     appview: false
        //                 }
        //             })
        //         } else if (!standalone && !safari) {
        //             // iOS webview
        //             setWebViewDetect({
        //                 android: {
        //                     webview: false,
        //                     appview: false
        //                 },
        //                 ios: {
        //                     webview: false,
        //                     appview: true
        //                 }
        //             })
        //         };
        //     }
        //     else {
        //         if (userAgent.includes('wv')) {
        //             // Android webview
        //             setWebViewDetect({
        //                 android: {
        //                     webview: true,
        //                     appview: false
        //                 },
        //                 ios: {
        //                     webview: false,
        //                     appview: false
        //                 }
        //             })
        //         } else {
        //             // Chrome
        //             setWebViewDetect({
        //                 android: {
        //                     webview: false,
        //                     appview: true
        //                 },
        //                 ios: {
        //                     webview: false,
        //                     appview: false
        //                 }
        //             })
        //         }
        //     }
        // }

        return <WrappedComponent
            {...props}
            {...isMobile}
            {...screenDetectSize}
        />;
    };
    return WithMobileDetectWrapper;
}

export default function mobileDetectHOC(WrappedComponent) {
    return withMobileDetect({
        WrappedComponent
    });
}