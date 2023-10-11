import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

export type Credentials = Partial<{
    /**
     * Bearer token used in the Authorization header
     */
    token: string
    /**
     * X-API-Key used in the headers
     */
    apiKey: string
}>

export class DefaultAxiosClient {
    createClient(
        clientConfig: AxiosRequestConfig,
        { apiKey, token }: Credentials
    ): AxiosInstance {
        const client = axios.create()
        client.defaults.baseURL = clientConfig.baseURL
        if (apiKey) {
            client.defaults.headers["X-API-Key"] = apiKey
        }
        if (token) {
            client.defaults.headers.common.Authorization = `Bearer ${token}`
        }
        return this.attachDefaultErrorHandler(client)
    }

    private attachDefaultErrorHandler(client: AxiosInstance) {
        client.interceptors.response.use(
            (response) => response.data,
            (error) => {
                if (!error?.response) {
                    return Promise.reject(error)
                }
                return Promise.reject({
                    status: error.response.status,
                    ...error.response.data
                })
            }
        )
        return client
    }
}
