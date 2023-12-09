import {
    CreateUserInput,
    ResetPasswordInput,
    createUserSchema,
    resetPasswordSchema,
    validator
} from "../schema"
import { AxiosInstance } from "axios"
import { ResponseMessage } from "../types"

type User = CreateUserInput

export type ApiKey = {
    /**
     * The optional api name e.g. "My App key"
     */
    name: string
    /**
     * The api key alias is unique and used to identify the key
     */
    keyAlias: string
    /**
     * User id of the api key
     */
    userId: string
    /**
     * API key status, can be "ENABLED" or "DISABLED"
     */
    status: "ENABLED" | "DISABLED"
}

export class Auth {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    /**
     * Create a new auth user
     * @param data - create user data model
     * @returns data attribute with message
     */
    async signUp(data: User): Promise<ResponseMessage> {
        return validator
            .validateJsonSchema(createUserSchema, data)
            .then(() =>
                this.client
                    .post<ResponseMessage>("/auth/sign-up", data)
                    .then((response) => response.data)
            )
    }

    /**
     * Logs user in and returns an auth token
     * @param data - login credentials
     * @returns a jwt authentication token
     */
    async signIn(data: User): Promise<{ token: string }> {
        return this.client
            .post<{ token: string }>("/auth/sign-in", data)
            .then((response) => response.data)
    }

    /**
     * Creates and returns a new API key
     * @returns the new API key
     */
    private async createApiKey(params: {
        name?: string
    }): Promise<{ apiKey: string }> {
        return this.client
            .post<{ apiKey: string }>("/auth/api-key", { name: params.name })
            .then((response) => response.data)
    }

    /**
     * Gets the current user's API keys
     * @returns the user's API keys
     */
    async getApiKeys(): Promise<Array<ApiKey>> {
        return this.client
            .get<Array<ApiKey>>("/auth/api-keys")
            .then((response) => response.data)
    }

    /**
     * Get API key by alias
     * @param alias - the API key alias
     * @returns the API key
     */
    async getApiKey(alias: string): Promise<ApiKey> {
        return this.client
            .get<ApiKey>(`/auth/api-keys/${alias}`)
            .then((response) => response.data)
    }

    /**
     * Update API key by alias
     *
     * Can also be used to revoke an API key by setting the status to "DISABLE"
     * @param alias - the API key alias
     */
    async updateApiKey(
        alias: string,
        params: { name?: string; status: "ENABLE" | "DISABLE" }
    ): Promise<ApiKey> {
        return this.client
            .patch<ApiKey>(`/auth/api-keys/${alias}`, params)
            .then((response) => response.data)
    }

    /**
     * Sends an OTP (One-Time PIN) to the email inbox that will be used to reset the password
     * @param email - email address
     * @returns an info message
     */
    async forgotPassword(email: string): Promise<ResponseMessage> {
        return this.client
            .post<ResponseMessage>("/auth/forgot-password", email)
            .then((response) => response.data)
    }

    /**
     * Resets the user's forgotten password
     * @param email - email address
     * @returns an info message
     */
    async resetPassword(data: ResetPasswordInput): Promise<ResponseMessage> {
        return Promise.all([
            validator.validateJsonSchema(resetPasswordSchema, data),
            validator.validatePassword(data.password)
        ]).then(() =>
            this.client
                .post<ResponseMessage>("/auth/reset-password", data)
                .then((response) => response.data)
        )
    }
}
