import { message } from 'antd'
import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GRIP_API_HOST,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

const handleRequest = async (config: AxiosRequestConfig) => {
  const accessToken = Cookies.get('access_token')

  if(accessToken === undefined) {
    delete config?.headers?.Authorization
  } else {
    config.headers!.Authorization = `Bearer ${accessToken}`
  }
  return config;
}

axiosInstance.defaults.withCredentials = true
axiosInstance.interceptors.request.use(
  handleRequest,
  async (error) => { return Promise.reject(error); }
)

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log(error)

      const {
        config,
        response: { status, data },
      } = error

      const errorRes = {
        config,
        status: status,
        data: data
      }

      if (status === 401) {
        if(data.error !== "Not authenticated") {
            window.location.pathname = '/login'
        }
        Cookies.remove('access_token')
      } 
      
      return errorRes
  }
)

export default axiosInstance