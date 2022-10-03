import React, { useState } from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import TopBarProgressComponent from "../control/loaderIndicator";

const LoadingTrackerContext = React.createContext({});

export const LoadingTrackerProvider = ({ children }) => {

    const { promiseInProgress } = usePromiseTracker();
    const [globalLoading, setGlobalLoading] = useState(false)
    return (
        <LoadingTrackerContext.Provider value={{ setGlobalLoading }}>
            {
                (promiseInProgress === true || globalLoading) ?
                    // <div className="modal fade tracker-loading in d-flex modal-open modal-dialog-centered show" role="dialog"
                    //     data-backdrop="true"
                    // // style={{ "zIndex": 3000, position: "fixed !important", "backgroundColor": "rgba(0, 0, 0, 0.5)" }}
                    // >
                    //     <div className="modal-dialog modal-dialog-centered" style={{ margin: 'auto' }} role="document">
                    //         <div className="modal-content" style={{ top: '0px' }}>
                    //             <div className="modal-body">
                    //                 <div className="spinner-border text-primary" role="status">
                    //                     <span className="sr-only">Loading...</span>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>
                    <TopBarProgressComponent />
                    : null
            }
            {children}
        </LoadingTrackerContext.Provider>
    );
};

export function useLoadingTrackerContext() {
    return React.useContext(LoadingTrackerContext);
}
