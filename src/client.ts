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
    static create(clientConfig: AxiosRequestConfig): AxiosInstance {
        const client = axios.create(clientConfig)
        client.defaults.baseURL = clientConfig.baseURL
        const apiKey = client.defaults.headers["X-API-Key"]
        if (!apiKey || !apiKey.toString().startsWith("WM.")) {
            throw new Error(`unexpected API Key token received: ${apiKey}`)
        }
        this.isHttpUrl(clientConfig.baseURL)
        client.defaults.headers["X-API-Key"] = apiKey
        return this.attachDefaultErrorHandler(client)
    }

    private static attachDefaultErrorHandler(client: AxiosInstance) {
        client.interceptors.response.use(
            (response) => response,
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

    private static isHttpUrl(baseURL: string | undefined) {
        if (!baseURL) {
            throw new Error(
                `cannot create an axios client with an undefined baseURL: ${baseURL}`
            )
        }
        const newUrl = new URL(baseURL)
        if (newUrl.protocol !== "http:" && newUrl.protocol !== "https:") {
            throw new Error(
                `unexpected url provided as baseURL for axios: ${baseURL}`
            )
        }
        return newUrl
    }
}
