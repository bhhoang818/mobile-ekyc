import { request } from "../shared/packages/service-adapter/axios"

export const hypervergeauth = () => {
    return request('POST', `/HyperVerge/hv-auth`);
}