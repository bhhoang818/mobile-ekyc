import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { operationSubscription } from "../../../services/hdbankService/webpush-subscription"

export default function usePushNotifications() {
    /**
     * // check push notifications are supported by the browser 
     * @returns 
     */
    const { language } = useSelector((state) => state.app);
    const { commons } = useSelector((state) => state.commonReducer);

    const checkNotificationSuported = () => { return 'serviceWorker' in navigator && 'PushManager' in window }
    const checkMbApp = () => localStorage.getItem("channelHDBank") === 'mbapp'

    const registerServiceWorker = async () => {
        if (checkNotificationSuported()) {
            const swRegistration = await navigator.serviceWorker.register("/sw.js");
            return swRegistration
        }
        else {
            return null;
        }
    }

    const requestNotificationPermission = async () => {
        if (checkNotificationSuported()) {
            const permission = await Notification.requestPermission()
            // value of permission can be 'granted', 'default', 'denied'
            // granted: user has accepted the request
            // default: user has dismissed the notification permission popup by clicking on x
            // denied: user has denied the request.
            return permission;
        }
        else {
            return null;
        }
    }

    let [serviceWorker, setServiceWorker] = useState(null)
    // const [userConsent, setSuserConsent] = useState(isWindowInit() && Notification.permission);
    //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
    //We initialize the userConsent with that value
    const [userSubscription, setUserSubscription] = useState(null);
    //to manage the use push notification subscription
    const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
    const [hashServerSubScription, setHashServerSubScription] = useState();
    //to manage the push server subscription
    const [error, setError] = useState(null);
    //to manage errors
    const [loadingServiceWorker, setLoadingServiceWorker] = useState(true);
    //to manage async actions

    useEffect(() => {
        async function fetchServiceWorkerNotification() {
            if (checkNotificationSuported()) {
                //instance sw generate
                const swRegistration = await registerServiceWorker();
                if (checkMbApp()) {
                    await swRegistration.unregister();
                    //do delete sub if neccessary
                }
                else {
                    const permission = await requestNotificationPermission();
                    if (permission === "granted") {
                        setServiceWorker(swRegistration);
                        onClickSusbribeToPushNotification(swRegistration);
                        // swRegistration.showNotification('debug', {});
                    }
                }
            }
            else
                return;
        }
        if (commons) {
            setLoadingServiceWorker(true);
            setError(false);
            fetchServiceWorkerNotification()
        }
    }, [commons]);

    //if the push notifications are supported, registers the service worker
    //this effect runs only the first render
    useEffect(() => {
        if (serviceWorker) {
            setLoadingServiceWorker(true);
            setError(false);
            const getExixtingSubscription = async () => {
                if (checkNotificationSuported()) {
                    const existingSubscription = await serviceWorker.pushManager.getSubscription();;
                    setUserSubscription(existingSubscription);
                    setLoadingServiceWorker(false);
                }
            };
            getExixtingSubscription();
        }
    }, [serviceWorker]);

    useEffect(() => {
        if (pushServerSubscriptionId && hashServerSubScription && language) {
            const userSubscription = {
                sub: hashServerSubScription,
                pushServerSubscriptionId: pushServerSubscriptionId
            }
            operationSubscription({
                local: language,
                data: {
                    "subscriptionId": pushServerSubscriptionId,
                    "endpoint": userSubscription?.sub?.endpoint,
                    "expirationTime": userSubscription?.sub?.expirationTime,
                    "userAgent": window?.navigator?.userAgent ?? null,
                    "keys": {
                        "p256dh": userSubscription?.sub?.keys?.p256dh,
                        "auth": userSubscription?.sub?.keys?.auth
                    }
                }
            })
        }
    }, [pushServerSubscriptionId, hashServerSubScription, language])
    //Retrieve if there is any push notification subscription for the registered service worker
    // this use effect runs only in the first render

    async function createNotificationSubscription(swRegistration) {
        if (commons?.data?.vapidKey)
            return await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: commons?.data?.vapidKey
            });
        else return null;
    }

    /**
     * define a click handler that creates a push notification subscription.
     * Once the subscription is created, it uses the setUserSubscription hook
     */
    const onClickSusbribeToPushNotification = (swRegistration) => {
        setLoadingServiceWorker(true);
        setError(false);
        createNotificationSubscription(swRegistration)
            .then(function (subscrition) {
                setUserSubscription(subscrition);
                setLoadingServiceWorker(false);
                onClickSendSubscriptionToPushServer(subscrition);
            })
            .catch((err) => {
                console.error(
                    "Couldn't create the notification subscription",
                    err,
                    'name:',
                    err?.name,
                    'message:',
                    err?.message,
                    'code:',
                    err?.code
                );
                swRegistration?.unregister().then(() => {
                    setError(err);
                    setLoadingServiceWorker(false);
                });
            });
    };

    /**
     * define a click handler that sends the push susbcribtion to the push server.
     * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
     */
    const onClickSendSubscriptionToPushServer = (subscrition) => {
        setLoadingServiceWorker(true);
        setError(false);
        axios
            .post('/subscription', { data: subscrition })
            .then(function (response) {
                setPushServerSubscriptionId(response?.data?.id);
                setHashServerSubScription(response?.data?.entity);
                setLoadingServiceWorker(false);
            })
            .catch((err) => {
                setLoadingServiceWorker(false);
                setError(err);
            });
    };

    /**
    * define a click handler that requests the push server to send a notification, passing the id of the saved subscription
    */
    const onClickSendNotificationBroadCast = async () => {
        setLoadingServiceWorker(true);
        setError(false);
        axios.get(`/subscriptionBroadCast`).catch((error) => {
            setLoadingServiceWorker(false);
            setError(error);
        });
        setLoadingServiceWorker(false);
    };


    return {
        onClickSusbribeToPushNotification,
        onClickSendSubscriptionToPushServer,
        pushServerSubscriptionId,
        onClickSendNotificationBroadCast,
        userSubscription,
        error,
        loadingServiceWorker
    }
};
