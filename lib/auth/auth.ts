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
        return validator(createUserSchema, data).then(async () => {
            return this.client
                .post<ResponseMessage>("/auth/sign-up", data)
                .then((response) => response.data)
        })
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
     * Generates a new API key
     * @returns the new API key
     */
    async generateApiKey(): Promise<{ apiKey: string }> {
        return this.client
            .post<{ apiKey: string }>("/auth/api-key")
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
        return validator(resetPasswordSchema, data).then(async () => {
            return this.client
                .post<ResponseMessage>("/auth/reset-password", data)
                .then((response) => response.data)
        })
    }
}
