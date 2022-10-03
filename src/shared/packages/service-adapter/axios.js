
import axios from 'axios'
// import { authenticationConstant } from "../../packages/globalConstant/authenticationConstant"
// import { CookieHelper } from "../../packages/utils/cookie"
import { trackPromise } from 'react-promise-tracker';
// import Emitter from "./emit"

axios.interceptors.request.use(function (config) {
    // const token = CookieHelper.getCookie(authenticationConstant.tokenKey);
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});


export function request(method,
    url,
    locale = 'vi',
    data,
    headers = {},
    isCheck = true,
    responseType = '',
    isTracking = true,
) {
    const defaultHeaders = {
        "Content-Type": "application/json",
        "local": locale,
        ...headers
    }

    const params = {
        method: method,
        url: `${process.env.REACT_APP_BASE_API_REKONITO_URL}${url}`,
        headers: defaultHeaders,
    };

    const isGet = (method) => {
        return method.toUpperCase() === 'GET'
    }

    if (responseType) {
        params['responseType'] = responseType
    }

    if (isGet(method)) {
        params['params'] = data || {};
    } else {
        params['data'] = data;
    }

    const promise = axios(params).then(response => {
        return { ...response, data: response?.data };
    }).catch(error => {
        //execute the status code enum and operation like logout , remove cookie when expired
        //Emitter.emit(EMITTER_EVENT.ACCESS_DENIED, error?.response?.data);
        if (error.response?.data) {
            return error.response?.data;
        }
        else {
            return error;
        }
        //throw error;
    });

    if (isTracking) {
        trackPromise(promise)
    }

    return promise
} 