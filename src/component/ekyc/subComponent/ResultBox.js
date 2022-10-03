import React, { useState, useEffect } from 'react'
import { reg_face } from "../../../service/RekonitoApiService"

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
    const [listImage, setListImage] = useState([]);
    const [approvedBT, setApprovedBT] = useState({
        data: null,
        show: false
    });
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
        modelData.id_yc_w360 = id;
        const blobs = dataUrlToFile(modelData.listImage[0]?.src, `test_${new Date().toLocaleDateString()}.png`);
        const formData = new FormData(); //formdata object
        formData.append('Code', 'hd018629'); //append the values with key, value pair
        formData.append('Image', blobs);
        formData.append('DataExtra', JSON.stringify(modelData));
        return reg_face(formData);
    };


    useEffect(() => {
        if (resultCheck?.isSuccess
            && resultCheck?.data?.front
            && resultCheck?.data?.back
            && resultCheck?.data?.face
            && resultCheck?.data?.facematch
        ) {
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

            insertMetaDataWhenNotMatch(null).then((res) => {
                console.log({ res });
                alert('Thanhf cong')
            });
        }
    }, [resultCheck])


    return (
        resultCheck?.isSuccess ||
        <>
            <button onClick={() => {
                func.retry();
            }} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Thử lại
            </button>
        </>
    )
}
export default ResultBox;