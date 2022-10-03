import { request } from "../shared/packages/service-adapter/axios"

export const hypervergeauth = () => {
    return request('POST', `/HyperVerge/hv-auth`);
}

export const reg_face = (data) => {
    return request('POST', `/MetaData/push-image-s3`, 'vi', data, { headers: { 'content-type': 'multipart/form-data' } });
}