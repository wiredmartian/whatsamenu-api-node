import { createUserSchema, validator } from "../schema"
import { AxiosInstance } from "axios"
export type CreateUser = {
    email: string
    /**
     * min 8 letter password, at least a symbol, upper and lower case letters and a number
     */
    password: string
}

export class User {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    async createUser(data: CreateUser): Promise<{ data: string }> {
        return validator(createUserSchema, data).then(async () => {
            const response = await this.client.post<{ data: string }>(
                "/auth/sign-up",
                data
            )
            return response.data
        })
    }
}
