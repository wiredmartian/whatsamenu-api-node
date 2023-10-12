import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

export type Credentials = {
    /**
     * X-API-Key used in the headers
     */
    apiKey: string
}

/**
 * Default http client using axios
 */
export class DefaultMenuHttpClient {
    static create(
        clientConfig: AxiosRequestConfig,
        { apiKey }: Credentials
    ): AxiosInstance {
        const client = axios.create()
        client.defaults.baseURL = clientConfig.baseURL
        if (!apiKey || !apiKey.startsWith("WM.")) {
            throw new Error(`unexpected API Key token received: ${apiKey}`)
        }
        client.defaults.headers["X-API-Key"] = apiKey
        return this.attachDefaultErrorHandler(client)
    }

    private static attachDefaultErrorHandler(client: AxiosInstance) {
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
