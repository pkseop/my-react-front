import axiosInstance from '../../../modules/api/Axios';
// import { ResponseModel } from '../../../types/response/CommonTypes';
// import { LoignResponse} from '../../../types/response/UserTypes'

export namespace AuthApi{
    
    const AUTH_API_PATH: string = '/v1/auth';

    export const deleteAuthHeader = () => {
      delete axiosInstance.defaults.headers.common["Authorization"]
    }

    // export const login = async (username: string, password: string) => {
    //   return axiosInstance.post<ResponseModel<LoignResponse>>(`${AUTH_API_PATH}/login`, { username, password })
    // }
}