import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useRouter } from "next/router";

const useGaTracker = () => {
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        ReactGA.initialize(process.env.GA_ID);
        // ReactGA.set({ page: window.location.pathname });
        // ReactGA.pageview(window.location.pathname);
        setInitialized(true);
    }, [router]);

    useEffect(() => {
        if (initialized) {
            ReactGA.set({ page: router?.asPath });
            ReactGA.pageview(router?.asPath);
        }
    }, [initialized, router]);
};

export default useGaTracker;