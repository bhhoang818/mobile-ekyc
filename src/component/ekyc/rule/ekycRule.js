const typeOfFrontDocPapersAllowed = [
    "cmnd_old_front",
    "cmnd_new_front",
    "cccd_front",
    "cccd_chip_front",
];
const typeOfBackDocPapersAllowed = [
    "cmnd_old_back",
    "cmnd_new_cccd_back",
    "cccd_chip_back",
    "cccd_back",
];
const mappingCardType = {
    cmnd_old_back: ["cmnd_old_front"],
    cmnd_new_cccd_back: ["cmnd_new_front", "cccd_front"],
    cccd_chip_back: ["cccd_chip_front"],
    cccd_back: ["cccd_front"],
};
const matchScore = 60;
const whiteListAcction = ["pass", "manualReview"];

const concatErrorMsg = (data) => {
    let errorMerge = "";
    // data?.map((x) => {
    //     errorMerge += x?.message + ", "
    // })
    return errorMerge;
}

export function isValidateFrontId(frontId) {
    try {
        /// Kiểm tra summary có lỗi gì không
        if (frontId.response.result.summary.details.length != 0) {
            if (frontId.response.result.summary.details?.some(x => ['042', '045'].includes(x.code))
                && !frontId.response.result.summary.details?.some(x => ['002'].includes(x.code))
            ) {
                return {
                    success: true,
                    msg: frontId.response.result.summary.details[0]?.message
                };
            }
            return {
                success: false,
                msg: concatErrorMsg(frontId.response.result.summary.details)//frontId.response.result.summary.details[0]?.message
            };
        }
        if (!whiteListAcction.includes(frontId.response.result.summary.action)) {
            return {
                success: false,
                msg: "Ảnh CMND/CCCD không hợp lệ. Vui lòng chụp lại theo hướng dẫn"
            };
        }
        var resultDetail = frontId.response.result.details[0];
        if (
            !resultDetail.type ||
            !typeOfFrontDocPapersAllowed.includes(resultDetail.type)
        ) {
            return {
                success: false,
                msg: "Loại giấy tờ không đúng. Vui lòng chụp đúng loại giấy tờ"
            };
        }

        var frontFieldsExtracted = resultDetail?.fieldsExtracted;
        var dob = frontFieldsExtracted?.dob?.value;

        if (!dob) {
            return {
                success: false,
                msg: "Không thể đọc được ngày sinh vui lòng chụp lại!"
            };
        }
        var idNumber = frontFieldsExtracted?.idNumber?.value;
        if (!idNumber) {
            return {
                success: false,
                msg: "Không thể đọc được số CMND/CCCD vui lòng chụp lại!"
            };
        }
        var name = frontFieldsExtracted?.name?.value;
        if (!name) {
            return {
                success: false,
                msg: "Không thể đọc được họ tên khách hàng vui lòng chụp lại!"
            };
        }
        return {
            success: true,
            msg: "Không thể đọc được họ tên khách hàng vui lòng chụp lại!"
        };
    } catch (e) {
        return {
            success: false,
            msg: e
        };
    }
}

export function isValidateBackId(backId, frontId) {
    try {
        if (
            !backId.response.result.details ||
            backId.response.result.details.length === 0
        ) {
            return {
                success: false,
                msg: "Không thể lấy dữ liệu từ hình ảnh đã chụp. Vui lòng chụp lại"
            };
        }
        var summary = backId.response.result.summary;

        // if (!whiteListAcction.includes(summary.action)) {
        //     /// Thông báo chụp ảnh chưa hợp lệ
        //     return {
        //         success: false,
        //         msg: "Ảnh CMND/CCCD không hợp lệ. Vui lòng chụp lại theo hướng dẫn"
        //     };
        // }

        var resultDetail = backId.response.result.details[0];
        if (
            !resultDetail.type ||
            !typeOfBackDocPapersAllowed.includes(resultDetail.type)
        ) {
            /// Lỗi loại giấy tờ không chính xác
            return {
                success: false,
                msg: "Loại giấy tờ không đúng. Vui lòng chụp đúng loại giấy tờ"
            };
        }

        var resultDetailFront = frontId.response.result.details[0];
        var typeFront = resultDetailFront.type;
        var typeBack = resultDetail.type;

        if (!mappingCardType[typeBack].includes(typeFront)) {
            /// Lỗi loại giấy tờ không chính xác
            return {
                success: false,
                msg: "Ảnh CMND/CCCD mặt trước và sau không cùng loại"
            };
        }

        var backFieldsExtracted = resultDetail?.fieldsExtracted;
        var doi = backFieldsExtracted?.doi?.value;

        if (!doi) {
            /// Lỗi loại giấy tờ không chính xác
            return {
                success: false,
                msg: "Không thể đọc được ngày cấp CMND vui lòng chụp lại!"
            };
        }

        var placeOfIssue = backFieldsExtracted?.placeOfIssue?.value;
        if (!placeOfIssue) {
            /// Lỗi loại giấy tờ không chính xác
            return {
                success: false,
                msg: "Không thể đọc được nơi cấp CMND vui lòng chụp lại!"
            };
        }

        if (backId.response.result.summary.details.length != 0) {
            if (backId.response.result.summary.details[0].code === "001") {
                return {
                    success: false,
                    msg: "Ảnh CMND/CCCD mặt trước và sau không cùng loại"
                };
            }
            if (backId.response.result.summary.details?.some(x => ['042', '045'].includes(x.code))
                && !backId.response.result.summary.details?.some(x => ['002'].includes(x.code))
            ) {
                return {
                    success: true,
                    msg: ""
                };
            }
            return {
                success: false,
                msg: concatErrorMsg(backId.response.result.summary.details) //backId.response.result.summary.details[0].message
            };
        }

        return {
            success: true,
            msg: null
        }
    } catch (e) {
        return {
            success: false,
            msg: e
        };
    }
}

export function isValidateFaceId(face) {
    try {
        if (!face.response.result) {
            return {
                success: false,
                msg: "Không thể lấy dữ liệu từ hình ảnh đã chụp. Vui lòng chụp lại"
            };
        }
        if (face.response.result.summary.details.length != 0) {
            if (face.response.result.summary.details?.some(x => x.code === '045')) {
                return {
                    success: true,
                    msg: ""
                };
            }
            return {
                success: false,
                msg: face.response.result.summary.details[0].message
            };
        }

        var summary = face.response.result.summary;
        if (!summary) {
            return {
                success: false,
                msg: "Không thể lấy dữ liệu từ hình ảnh đã chụp. Vui lòng chụp lại"
            };
        }

        if (!whiteListAcction.includes(summary.action)) {
            return {
                success: false,
                msg: "Ảnh chân dung chưa hợp lệ. Vui lòng chụp lại"
            };
        }
        var liveFace = face.response.result.liveFace;
        if (!liveFace || !liveFace.value || liveFace.value != "yes") {
            /// Thông báo chụp ảnh chân dung chưa hợp lệ
            return {
                success: false,
                msg: "Ảnh chân dung chưa hợp lệ. Vui lòng chụp lại"
            };
        }
        return {
            success: true,
            msg: null
        };
    } catch (e) {
        return {
            success: false,
            msg: e
        };
    }
}

export function isValidateFaceMatch(faceMatch) {
    try {
        if (!faceMatch.response.result) {
            return {
                success: false,
                msg: "Không thể lấy dữ liệu từ hình ảnh đã chụp. Vui lòng chụp lại"
            };
        }
        if (faceMatch.response.result.match_score < matchScore) {
            return {
                success: false,
                msg: "Ảnh CMND/CCCD và Chân Dung chưa khớp"
            };
        }
        return {
            success: true,
            msg: "Ảnh CMND/CCCD và Chân Dung khớp"
        };
    } catch (e) {
        return {
            success: false,
            msg: e
        };
    }
}