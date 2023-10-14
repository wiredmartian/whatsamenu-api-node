import { JSONSchemaType } from "ajv"

/**
 * Currently a menu item can only exist under a menu group
 */
export type CreateMenuItemInput = {
    /**
     * menu item name
     */
    name: string
    /**
     * brief summary of the menu item
     */
    summary: string
    /**
     * verbose description of the menu item
     */
    description?: string
    /**
     * menu item price
     */
    price?: number
    /**
     * allergens identifiers
     * @example ["3", "6"]
     */
    allergens?: string[]
}

export const createMenuItemSchema: JSONSchemaType<CreateMenuItemInput> = {
    type: "object",
    additionalProperties: true,
    properties: {
        name: { type: "string", minLength: 1 },
        summary: { type: "string", minLength: 1 },
        description: { type: "string", nullable: true },
        price: { type: "number", nullable: true },
        allergens: {
            type: "array",
            nullable: true,
            default: [],
            items: {
                type: "string"
            }
        }
    },
    required: ["name", "summary"]
}
