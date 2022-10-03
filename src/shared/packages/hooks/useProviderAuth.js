import React, { useEffect, useState } from "react";

export function useProvideAuth(props) {
    const cookieKeyChecker = () => {
        if (typeof window !== "undefined") {
            const checktoken = localStorage.getItem('crosstoken')
            if (checktoken)
                return {
                    logged: true,
                    key: null
                }
            else
                return {
                    logged: false,
                    key: null
                }
        }
        else return {
            logged: false,
            key: null
        }
    }

    const [ebankLogged, setEbankLogged] = useState(() => {
        return cookieKeyChecker();
    })

    const checkToken = () => {
        const checker = cookieKeyChecker();
        setEbankLogged(checker);
    }

    return {
        ebankLogged,
        checkToken
    };
}
