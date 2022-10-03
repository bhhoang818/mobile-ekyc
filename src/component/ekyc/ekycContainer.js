import React, { useState, useEffect } from "react";
import logo from "../../logo.svg";
import { hypervergeauth } from "../../service/RekonitoApiService"
import { isValidateFrontId } from "./rule/ekycRule";
import md5 from "md5";

const EkycContainer = (props) => {
    const [loadScript, setLoadScript] = useState(false);
    const [stepEkyc, setStepEkyc] = useState(0);
    var attemptsCountConfig = 10000;
    const [resultCheck, setResultCheck] = useState({
        isSuccess: null,
        data: {
            front: null,
            back: null,
            face: null,
            facematch: null
        }
    })

    useEffect(() => {
        const tokenParam = new URLSearchParams(window.location.search)?.get('token');
        if (tokenParam) {
            const script = document.createElement('script');
            script.src = "/js/ekyc_trieu.js";
            script.async = true;
            document.body.appendChild(script);
            setTimeout(() => {
                setLoadScript(true);
            }, 500);
            return () => {
                document.body.removeChild(script);
                window?.stream?.getTracks()?.forEach((track) => track?.stop());
                window.HyperSnapSDK.endUserSession();
            }
        }
    }, [])

    useEffect(() => {
        if (loadScript) {
            startEKYC();
        }
        else {
            setLoadScript(false);
        }
    }, [loadScript])


    function initHV(token) {
        window.HyperSnapSDK.init(
            token,
            // eslint-disable-line
            HyperSnapParams?.Region?.AsiaPacific
        );
        window.HyperSnapSDK.startUserSession();
        setTimeout(() => {
            startFrontIdEKYC();
        }, 100);
    }

    function functionBaseStep(step) {
        switch (step) {
            case 1: return startFrontIdEKYC
            // case 2: return startBackIdEKYC
            // case 3: return startFaceEkyc
            default: return startFrontIdEKYC
        }
    }

    function errorDisplay(errCode, errMsg) {
        resultCheck.isSuccess = false;
        setResultCheck({ ...resultCheck })
    }

    function startEKYC() {
        hypervergeauth().then((res) => {
            if (res?.data?.statusCode === '200' && res?.data?.result?.token) {
                const token = res?.data?.result?.token;
                initHV(token);
            }
        }).catch((err) => {
        })
    }

    const backtoScreenReg = (HVError) => {
        if (HVError?.errorCode === '013') {
        }
        else {
            errorDisplay(HVError?.errorCode, HVError?.errorMsg)
        }
    }

    //start ekyc progress
    async function startFrontIdEKYC() {
        // setLoading(true);
        setStepEkyc(1)
        resultCheck.isSuccess = null;
        setResultCheck({ ...resultCheck })
        const hvDocConfig = new window.HVDocConfig();
        const startTransactionId = md5(
            JSON.stringify({
                nationalId: 'vn',
                username: 'mobile-ekyc',
            })
        );

        HyperSnapSDK.startUserSession(startTransactionId);

        hvDocConfig.docTextConfig.setDocReviewRetakeButtonText("Chụp lại");
        hvDocConfig.docTextConfig.setDocCaptureTitle("Xác thực điện tử");
        hvDocConfig.docTextConfig.setDocCaptureDescription("Vui lòng chụp ảnh mặt trước CMND/CCCD của bạn");
        hvDocConfig.docTextConfig.setDocInstructions1(
            "Giữa CMND/CCCD nằm trong khung chụp"
        );
        hvDocConfig.docTextConfig.setDocInstructions2(
            "Không đưa CMND/CCCD ra ngoài khung chụp"
        );
        hvDocConfig.docTextConfig.setDocInstructions3(
            "Tránh ánh sáng làm mờ nhòe CMND/CCCD"
        );
        hvDocConfig.docTextConfig.setDocInstructionsProceed("Tiến hành chụp");
        hvDocConfig.docTextConfig.setDocInstructionsTitle(
            "Hướng dẫn chụp CMND/CCCD"
        );
        hvDocConfig.docTextConfig.setDocCaptureBottomDescription(
            "Đảm bảo CMND/CCCD không lóa và ở bên trong khung hình"
        );
        hvDocConfig.docTextConfig.setDocCaptureDescription(
            "Chụp mặt trước CMND/CCCD của bạn"
        );
        hvDocConfig.docTextConfig.docCaptureReviewTopTitle =
            "Xem lại CMND/CCCD mặt trước";
        hvDocConfig.docTextConfig.setDocUploadReviewBottomDescription(
            "Vui lòng xem lại giấy tờ đã chụp"
        );
        hvDocConfig.docTextConfig.setDocRetakeScreenTitle("Yêu cầu chụp lại");
        hvDocConfig.docUIConfig.imageSubmitBtnText = "Tiếp tục";
        hvDocConfig.docTextConfig.setDocRetakeScreenButtonText("Chụp lại");

        hvDocConfig.setOCRDetails(
            "https://vnm-docs.hyperverge.co/v2/nationalID",
            hvDocConfig.DocumentSide.FRONT,
            { locale: "vn" },
            {}
        );
        hvDocConfig.setShouldShowInstructionPage(false);
        hvDocConfig.setShouldShowDocReviewScreen(true);

        hvDocConfig.docTextConfig.setDocReviewDescription(
            "Xác nhận ảnh mặt trước đã chụp"
        );
        hvDocConfig.docTextConfig.docCaptureReviewBottomDescription =
            "Kiểm tra lại hình ảnh đã chụp";

        hvDocConfig.docTextConfig.setDocUploadReviewReuploadButtonText("Chụp lại");

        const callback = (HVError, HVResponse) => {
            if (HVError) {
                backtoScreenReg(HVError);
                return;
            } else {
                if (HVResponse?.response?.status === "failure") {
                    errorDisplay(HVResponse?.response?.statusCode, HVResponse?.response?.result?.summary?.details[0]?.message)
                    return;
                }
                var attemptsCount = HVResponse.getAttemptsCount();
                if (attemptsCount > attemptsCountConfig) {
                    errorDisplay("400", "Bạn đã thực hiện xác thực định danh quá số lần qui định")
                    return;
                }

                const isValidFront = isValidateFrontId(HVResponse);
                if (!isValidFront.success) {
                    errorDisplay("400", isValidFront.msg);
                    return;
                }
                else {
                    resultCheck.data.front = HVResponse;
                    setResultCheck({ ...resultCheck })
                    //startBackIdEKYC();
                }
            }
        };
        window.HVDocsModule.start(hvDocConfig, callback);
    }

    return (
        <div className="max-w-md mx-auto flex p-6 bg-gray-100 mt-10 rounded-lg shadow-xl">
            <div className="ml-6 pt-1">
                <h1 className="text-2xl text-blue-700 leading-tight text-center">
                    Tailwind and Create React App
                </h1>
                <p className="text-base text-gray-700 leading-normal text-center">
                    A complete boilerplate for your next tailwind and React project!
                </p>
                <div>
                    <img src={logo} alt="Tailwind and Create React App" />
                </div>
            </div>
        </div>
    )
}

export default EkycContainer;