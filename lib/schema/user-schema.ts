import { JSONSchemaType } from "ajv"

/**
 * create a new user input data model
 */
export type CreateUserInput = {
    email: string
    /**
     * min 8 letter password, at least a symbol, upper and lower case letters and a number
     */
    password: string
}

/**
 * Reset password input model
 */
export type ResetPasswordInput = CreateUserInput & {
    /** One-Time-PIN number */
    otp: string
}

export const createUserSchema: JSONSchemaType<CreateUserInput> = {
    type: "object",
    additionalProperties: true,
    properties: {
        email: {
            type: "string",
            minLength: 6
            // pattern: /^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$/
        },
        password: {
            type: "string",
            minLength: 8
            // min 8 letter password, with at least a symbol, upper and lower case letters, and a number
            // pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        }
    },
    required: ["email", "password"]
}

export const resetPasswordSchema: JSONSchemaType<ResetPasswordInput> = {
    type: "object",
    properties: {
        email: {
            type: "string",
            minLength: 6
        },
        password: {
            type: "string",
            minLength: 8
        },
        otp: {
            type: "string",
            minLength: 6
        }
    },
    required: ["email", "password", "otp"]
}
