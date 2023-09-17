import { Province } from "./constants"

export type Address = {
    addressId: string
    line1: string
    line2?: string
    city: string
    state: Province
    /** South Africa */
    country: string
    latitude: number
    longitude: number
}

/** base types */

export type DateMetadata = {
    updated: string
    created: string
}
