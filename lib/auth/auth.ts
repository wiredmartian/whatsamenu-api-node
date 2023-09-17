import {
    CreateUserInput,
    ResetPasswordInput,
    createUserSchema,
    resetPasswordSchema,
    validator
} from "../schema"
import { AxiosInstance } from "axios"

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
    async signUp(data: User): Promise<{ data: string }> {
        return validator(createUserSchema, data).then(async () => {
            return this.client
                .post<{ data: string }>("/auth/sign-up", data)
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
    async generateApiKey(): Promise<{ accessKey: string }> {
        return this.client
            .post<{ accessKey: string }>("/auth/api-key")
            .then((response) => response.data)
    }

    /**
     * Sends an OTP (One-Time PIN) to the email inbox that will be used to reset the password
     * @param email - email address
     * @returns an info message
     */
    async forgotPassword(email: string): Promise<{ message: string }> {
        return this.client
            .post<{ message: string }>("/auth/forgot-password", email)
            .then((response) => response.data)
    }

    /**
     * Resets the user's forgotten password
     * @param email - email address
     * @returns an info message
     */
    async resetPassword(
        data: ResetPasswordInput
    ): Promise<{ message: string }> {
        return validator(resetPasswordSchema, data).then(async () => {
            return this.client
                .post<{ message: string }>("/auth/reset-password", data)
                .then((response) => response.data)
        })
    }
}
