import { JSONSchemaType } from "ajv"
import { CreateUser } from "../user"

export const createUserSchema: JSONSchemaType<CreateUser> = {
    type: "object",
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
