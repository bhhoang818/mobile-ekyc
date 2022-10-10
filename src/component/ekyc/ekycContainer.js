/* eslint-disable */
import React, { useState, useEffect } from "react";
import { hypervergeauth, getTokenMobile } from "../../service/RekonitoApiService"
import { isValidateFrontId, isValidateBackId, isValidateFaceId, isValidateFaceMatch } from "./rule/ekycRule";
import md5 from "md5";
import ResultBox from "./subComponent/ResultBox";
import { Loading } from "../../shared/packages/control/loading/loading";
import toastAdapter from "../../shared/packages/service-adapter/toastAdapter";

const EkycContainer = (props) => {
    const [loadScript, setLoadScript] = useState(false);
    const [stepEkyc, setStepEkyc] = useState(0);
    const [loading, setLoading] = useState(false);
    var attemptsCountConfig = 10000;
    const [resultCheck, setResultCheck] = useState({
        isSuccess: null,
        dataToken: null,
        tokenEkycMobile: null,
        errorMsg: null,
        data: {
            front: null,
            back: null,
            face: null,
            facematch: null
        }
    })

    useEffect(() => {
        setLoading(true);
        const tokenParam = new URLSearchParams(window.location.search)?.get('token');
        if (tokenParam) {
            getTokenMobile(tokenParam).then((res) => {
                if (res?.data?.succeeded) {
                    resultCheck.tokenEkycMobile = tokenParam;
                    resultCheck.dataToken = res?.data?.data ?? null;
                    setResultCheck({ ...resultCheck });
                    const script = document.createElement('script');
                    script.src = `${process.env.PUBLIC_URL}/js/ekyc_trieu.js`;
                    script.async = true;
                    document.body.appendChild(script);
                    setTimeout(() => {
                        setLoadScript(true);
                    }, 0);
                    return () => {
                        document.body.removeChild(script);
                        window?.stream?.getTracks()?.forEach((track) => track?.stop());
                        window.HyperSnapSDK.endUserSession();
                    }
                }
                else {
                    errorDisplay(null, res?.data?.message);
                    setLoading(false)
                }
            }).catch((err) => {
                errorDisplay(null, err?.message);
                setLoading(false)
            })
        }
        else {
            errorDisplay(null, "Không xác thực được token");
            setLoading(false)
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
            HyperSnapParams?.Region?.AsiaPacific
        );
        window.HyperSnapSDK.startUserSession();
        setTimeout(() => {
            startFrontIdEKYC();
            setLoading(false);
        }, 100);
    }

    function functionBaseStep(step) {
        switch (step) {
            case 0: return () => window.location.reload();
            case 1: return startFrontIdEKYC
            case 2: return startBackIdEKYC
            case 3: return startFaceEkyc
            default: return startFrontIdEKYC
        }
    }

    function errorDisplay(errCode, errMsg) {
        resultCheck.isSuccess = false;
        resultCheck.errorMsg = errMsg;
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
            toastAdapter.toast("error", "Kiểm tra thất bại", HVError?.errorMsg)
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
                    toastAdapter.toast("success", "Kiểm tra mặt trước CMND/CCCD thành công", "")
                    resultCheck.data.front = HVResponse;
                    setResultCheck({ ...resultCheck })
                    startBackIdEKYC();
                }
            }
        };
        window.HVDocsModule.start(hvDocConfig, callback);
    }

    function startBackIdEKYC() {
        setStepEkyc(2);
        resultCheck.isSuccess = null;
        setResultCheck({ ...resultCheck })
        const hvDocConfig = new window.HVDocConfig();
        hvDocConfig.docTextConfig.setDocReviewRetakeButtonText("Chụp lại");
        hvDocConfig.docTextConfig.setDocCaptureTitle("Xác thực điện tử");
        hvDocConfig.docTextConfig.setDocCaptureDescription("Vui lòng chụp ảnh mặt sau CMND/CCCD của bạn");
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
            "Chụp mặt sau CMND/CCCD của bạn"
        );
        hvDocConfig.docTextConfig.docCaptureReviewTopTitle =
            "Xem lại CMND/CCCD mặt sau";
        hvDocConfig.docTextConfig.setDocUploadReviewBottomDescription(
            "Vui lòng xem lại giấy tờ đã chụp"
        );
        hvDocConfig.docTextConfig.setDocRetakeScreenTitle("Yêu cầu chụp lại");
        hvDocConfig.docUIConfig.imageSubmitBtnText = "Tiếp tục";
        hvDocConfig.docTextConfig.setDocRetakeScreenButtonText("Chụp lại");

        hvDocConfig.setOCRDetails(
            "https://vnm-docs.hyperverge.co/v2/nationalID",
            hvDocConfig.DocumentSide.BACK,
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
                const isValidBack = isValidateBackId(HVResponse, resultCheck.data.front);
                if (!isValidBack.success) {
                    errorDisplay("400", isValidBack.msg);
                    return;
                }
                else {
                    toastAdapter.toast("success", "Kiểm tra mặt sau CMND/CCCD thành công", "")
                    resultCheck.data.back = HVResponse;
                    setResultCheck({ ...resultCheck })
                    startFaceEkyc();
                }
            }
        };
        window.HVDocsModule.start(hvDocConfig, callback);
    }

    function startFaceEkyc() {
        setStepEkyc(3)
        resultCheck.isSuccess = null;
        setResultCheck({ ...resultCheck })
        var hvFaceConfig = new HVFaceConfig();
        hvFaceConfig.faceTextConfig.setFaceCaptureTitle("Chân dung");
        hvFaceConfig.faceTextConfig.setFaceCaptureBottomDescription(
            "Đảm bảo khuôn mặt nằm trong khung chụp"
        );
        hvFaceConfig.faceTextConfig.setFaceNotDetectedDescription(
            "Đảm bảo khuôn mặt nằm trong khung chụp"
        );
        hvFaceConfig.faceTextConfig.setFaceDetectedDescription("Chụp ngay");
        hvFaceConfig.faceTextConfig.setFaceTooBigDescription(
            "Vui lòng di chuyển ra khỏi camera"
        );
        hvFaceConfig.faceTextConfig.setFaceCaptureReviewTitle(
            "Xem lại ảnh chân dung của bạn"
        );
        hvFaceConfig.setShouldShowInstructionPage(false);

        const callback = (HVError, HVResponse) => {
            if (HVError) {
                backtoScreenReg(HVError);
                return;
            } else {
                var attemptsCount = HVResponse.getAttemptsCount();
                if (attemptsCount > attemptsCountConfig) {
                    errorDisplay("400", "Bạn đã thực hiện xác thực định danh quá số lần qui định")
                    return;
                }
                const isValidBack = isValidateFaceId(HVResponse);
                if (!isValidBack.success) {
                    errorDisplay("400", isValidBack.msg)
                    return;
                }
                else {
                    toastAdapter.toast("success", "Kiểm tra khuôn mặt thành công", "")
                    resultCheck.data.face = HVResponse;
                    setResultCheck({ ...resultCheck })
                    startFaceMatchEkyc();
                }
            }
        };
        window.HVFaceModule.start(hvFaceConfig, callback);
    }

    function startFaceMatchEkyc() {
        resultCheck.isSuccess = null;
        setResultCheck({ ...resultCheck })
        const callback = async (HVError, HVResponse) => {
            if (HVError) {
                backtoScreenReg(HVError);
                return;
            }
            if (HVResponse) {
                const isValidFaceMatch = isValidateFaceMatch(HVResponse);
                if (!isValidFaceMatch.success) {
                    errorDisplay("400", isValidFaceMatch.msg);
                    return;
                }
                else {
                    toastAdapter.toast("success", "Kiểm tra khớp khuôn mặt với GTTT thành công", "")
                    resultCheck.isSuccess = true;
                    resultCheck.data.facematch = HVResponse;
                    setResultCheck({ ...resultCheck });
                }
            }
        };

        HVNetworkHelper.makeFaceMatchCall(
            resultCheck.data.front?.imgBase64,
            resultCheck.data.face?.imgBase64,
            {},
            {},
            callback
        );
    }

    return (
        <>
            {
                loading &&
                <Loading />
            }
            {
                resultCheck.isSuccess !== null &&
                <ResultBox {...props} func={{
                    retry: functionBaseStep(stepEkyc)
                }} resultCheck={resultCheck} />
            }
        </>
    )
}

export default EkycContainer;