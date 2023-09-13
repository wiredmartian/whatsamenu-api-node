import { DateMetadata, Province } from "../types"

export type RestaurantResult = {
    restaurantId: string
    name: string
    summary?: string
    distance?: number
    imageUrl: string
    address: Address
} & DateMetadata

type Address = {
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
