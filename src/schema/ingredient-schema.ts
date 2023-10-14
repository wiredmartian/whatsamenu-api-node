import { JSONSchemaType } from "ajv"

export type CreateIngredientInput = {
    name: string
    menuItemId: number
}

export const createIngredientSchema: JSONSchemaType<CreateIngredientInput> = {
    type: "object",
    additionalProperties: true,
    properties: {
        name: { type: "string", minLength: 1 },
        menuItemId: { type: "integer", minimum: 1 }
    },
    required: ["name", "menuItemId"]
}
