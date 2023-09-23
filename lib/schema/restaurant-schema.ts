import { JSONSchemaType } from "ajv"
import { Province } from "../types"

export type CreateRestaurantInput = {
    line1: string
    line2: string
    city: string
    state: Province
    country: string
    latitude: number
    longitude: number
    name: string
    summary: string
}
export const createRestaurantSchema: JSONSchemaType<CreateRestaurantInput> = {
    type: "object",
    additionalProperties: false,
    properties: {
        line1: { type: "string", minLength: 1 },
        line2: { type: "string" },
        city: { type: "string", minLength: 1 },
        country: { type: "string" },
        state: {
            type: "string",
            enum: Object.keys(Province) as readonly Province[]
        },
        latitude: { type: "number" },
        longitude: { type: "number" },
        name: { type: "string", minLength: 1 },
        summary: { type: "string", minLength: 10 }
    },
    required: [
        "line1",
        "line2",
        "city",
        "state",
        "latitude",
        "longitude",
        "name",
        "summary"
    ]
}
