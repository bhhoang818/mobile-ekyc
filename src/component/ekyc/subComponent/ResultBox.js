/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { reg_face } from "../../../service/RekonitoApiService"
import { Loading } from '../../../shared/packages/control/loading/loading';
import toastAdapter from '../../../shared/packages/service-adapter/toastAdapter';
import { encrypt } from '../../../service/encode';

export function dataUrlToFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    if (arr.length < 2) { return undefined; }
    const mimeArr = arr[0].match(/:(.*?);/);
    if (!mimeArr || mimeArr.length < 2) { return undefined; }
    const mime = mimeArr[1];
    const buff = Buffer.from(arr[1], 'base64');
    return new File([buff], filename, { type: mime });
}

const ResultBox = (props) => {
    const { func, resultCheck } = props;
    const [loading, setLoading] = useState(false);
    const [modelData, setModelData] = useState({
        fullName: null,
        doB: null,
        cccd_number: null,
        ngaycap_cccd: null,
        ngayhethan_cccd: null,
        gender: null,
        noithuongtru: null,
        listImage: [],
        id_yc_w360: null
    })

    const insertMetaDataWhenNotMatch = (id = null) => {
        const getId_yc = resultCheck?.dataToken?.dataExtra && JSON.parse(resultCheck?.dataToken?.dataExtra)?.id_yc_w360;
        modelData.id_yc_w360 = getId_yc ?? null;
        const blobs = dataUrlToFile(modelData.listImage[0]?.src, `test_${new Date().toLocaleDateString()}.png`);
        const formData = new FormData(); //formdata object
        const authSessionKey = encrypt(resultCheck?.tokenEkycMobile);
        formData.append('Code', resultCheck?.dataToken?.code); //append the values with key, value pair
        formData.append('Image', blobs);
        formData.append('DataExtra', JSON.stringify(modelData));
        formData.append('SessionId', authSessionKey)
        reg_face(formData).then((res) => {
            if (res?.data?.succeeded === false) {
                toastAdapter.toast('error', res?.data?.message, "")
            }
            else {
                setLoading(false);
                toastAdapter.toast('success', 'Xác thực eKYC hoàn tất', "")
            }
        }).catch((err) => {
            setLoading(false);
            toastAdapter.toast('error', 'Xác thực eKYC thất bại', err?.message)
        });
    };


    useEffect(() => {
        if (resultCheck?.isSuccess
            && resultCheck?.data?.front
            && resultCheck?.data?.back
            && resultCheck?.data?.face
            && resultCheck?.data?.facematch
        ) {
            setLoading(true);
            modelData.fullName = resultCheck?.data?.front?.response?.result?.details[0]?.fieldsExtracted?.name ?? null;
            modelData.doB = resultCheck?.data?.front?.response?.result?.details[0]?.fieldsExtracted?.dob ?? null;
            modelData.cccd_number = resultCheck?.data?.front?.response?.result?.details[0]?.fieldsExtracted?.idNumber ?? null;
            modelData.ngaycap_cccd = resultCheck?.data?.back?.response?.result?.details[0]?.fieldsExtracted?.doi ?? null;
            modelData.ngayhethan_cccd = resultCheck?.data?.front?.response?.result?.details[0]?.fieldsExtracted?.doe ?? null;
            modelData.gender = resultCheck?.data?.front?.response?.result?.details[0]?.fieldsExtracted?.gender ?? null;
            modelData.noithuongtru = resultCheck?.data?.front?.response?.result?.details[0]?.fieldsExtracted?.permanentAddress ?? null;
            modelData.listImage = [
                {
                    id: 1,
                    type: 'chandung',
                    name: 'Hình chân dung',
                    src: resultCheck.data.face?.imgBase64
                },
                {
                    id: 2,
                    type: 'cccd_front',
                    name: 'CCCD/CMND mặt trước',
                    src: resultCheck.data.front?.imgBase64
                },
                {
                    id: 3,
                    type: 'cccd_back',
                    name: 'CCCD/CMND mặt sau',
                    src: resultCheck.data.back?.imgBase64
                }
            ]
            setModelData({ ...modelData });
            insertMetaDataWhenNotMatch(null);
        }
    }, [resultCheck])


    return (
        resultCheck?.isSuccess ?
            <>
                {
                    loading ?
                        <>
                            <Loading />
                        </>
                        :
                        <div class="grid h-screen place-items-center">
                            <div class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <svg class="mb-2 w-10 h-10 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd"></path><path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path></svg>
                                <a href="#">
                                    <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Đăng ký eKYC thành công</h5>
                                </a>
                                <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                    Vui lòng kiểm tra lại thông tin eKYC từ Web360
                                </p>
                            </div>
                        </div>
                }
            </>
            :
            <div class="grid h-screen place-items-center">
                {
                    <div class="max-w-sm rounded overflow-hidden shadow-lg">
                        <div class="px-6 py-4">
                            <div class="font-bold text-xl mb-2">Có lỗi xảy ra</div>
                            <p class="text-gray-700 text-base">
                                {resultCheck?.errorMsg ?? "Lỗi hệ thống"}
                            </p>
                        </div>
                        <div class="px-6 pt-4 pb-2 items-center">
                            <div class="p-2 flex flex-col justify-center">
                                <button onClick={() => {
                                    func.retry();
                                }} class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div >
    )
}
export default ResultBox;