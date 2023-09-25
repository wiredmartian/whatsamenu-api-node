import { JSONSchemaType } from "ajv"

export type CreateMenuGroupInput = {
    name: string
    summary?: string
}

export const createMenuGroupSchema: JSONSchemaType<CreateMenuGroupInput> = {
    type: "object",
    properties: {
        name: { type: "string", minLength: 1 },
        summary: { type: "string", nullable: true }
    },
    required: ["name"]
}
