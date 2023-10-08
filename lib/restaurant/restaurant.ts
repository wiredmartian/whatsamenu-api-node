import { AxiosInstance } from "axios"
import { Address, ResponseMessage } from "../types"
import {
    CreateRestaurantInput,
    createRestaurantSchema,
    validator
} from "../schema"
import { MenuResult } from "../menu"

/**
 * Restaurant API response type
 */
export type RestaurantResult = {
    /** unique identifier */
    restaurantId: string
    /**
     * restaurant alias is an id alias unique to each restaurant
     * @example dukkah-florida
     * */
    alias: string | null
    /** restaurant name */
    name: string
    /** brief summary  */
    summary?: string
    /**
     * when returned from /restaurants/near-me, this field will have a value
     *
     * the value is the distance between current location and each restaurant returned
     */
    distance?: number
    /** restaurant banner image url */
    imageUrl: string
    /** restaurant physical location */
    address: Address
}

export class Restaurant {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    /**
     * Creates a new restaurant
     * @param data - restaurant creation input data
     * @returns response message
     */
    async create(data: CreateRestaurantInput): Promise<ResponseMessage> {
        return validator
            .validateJsonSchema(createRestaurantSchema, data)
            .then(() =>
                this.client
                    .post<ResponseMessage>("/restaurants", data)
                    .then((response) => response.data)
            )
    }

    /**
     * Updates a restaurant
     * @param id - restaurant id
     * @param data - restaurant update input data
     * @returns response message
     */
    async update(
        id: number,
        data: CreateRestaurantInput
    ): Promise<ResponseMessage> {
        return validator
            .validateJsonSchema(createRestaurantSchema, data)
            .then(() =>
                this.client
                    .put<ResponseMessage>(`/restaurants/${id}`, data)
                    .then((response) => response.data)
            )
    }

    /**
     * Marks a restaurant and all it's dependents for deletion
     * @param id - restaurant id or alias
     */
    async delete(id: string): Promise<ResponseMessage> {
        return this.client
            .delete<ResponseMessage>(`/restaurants/${id}`)
            .then((response) => response.data)
    }

    /**
     * Gets a list of restaurants
     * @returns list of restaurants
     */
    async getRestaurants(): Promise<Array<RestaurantResult>> {
        return this.client
            .get<Array<RestaurantResult>>(`/restaurants`)
            .then((response) => response.data)
    }

    /**
     * Gets a restaurant by Id
     * @param id - restaurant Id
     */
    async getRestaurant(id: number): Promise<RestaurantResult> {
        return this.client
            .get<RestaurantResult>(`/restaurants/${id}`)
            .then((response) => response.data)
    }

    /**
     * Gets a restaurant QR Code
     * @param id - restaurant id
     * @returns a base64 qr code
     */
    async getQRCode(id: number): Promise<{ imageUri: string }> {
        return this.client
            .get<{ imageUri: string }>(`restaurants/${id}/qrcode`)
            .then((response) => response.data)
    }

    /**
     * Search restaurants by name
     * @param query - search term
     * @param limit - max results from search to return
     */
    async search(
        query: string,
        limit: number
    ): Promise<Array<RestaurantResult>> {
        return this.client
            .get<Array<RestaurantResult>>(
                `/restaurants/search?query=${query}&limit=${limit}`
            )
            .then((response) => response.data)
    }
    /**
     * FIXME: should this be a post?
     * Gets a list of restaurant near specified coordinates
     * Radius (km) specifies the distance
     * @param query - input data for the query
     * @returns list of restaurants near
     */
    async getNearMe(query: {
        latitude: number
        longitude: number
        radius: number
    }): Promise<RestaurantResult[]> {
        const coordinates = `${query.latitude},${query.longitude}`
        const rgxExpression =
            /^((-?|\+?)?\d+(\.\d+)?),\s*((-?|\+?)?\d+(\.\d+)?)$/gi
        if (!rgxExpression.test(coordinates)) {
            throw new Error("invalid GPS coordinates")
        }

        const lat = parseInt(query.latitude.toString(), 10)
        const lon = parseInt(query.longitude.toString(), 10)

        if (lat > 90 || lat < -90 || lon > 90 || lon < -90) {
            throw new Error("GPS coordinates out of range")
        }

        return this.client
            .post<RestaurantResult[]>(`/restaurants/near-me`, query)
            .then((response) => response.data)
    }

    /**
     * Gets restaurants by owner
     * Owner is determined by token/api passed to the request headers
     * @returns list of restaurants
     */
    async getByOwner(): Promise<RestaurantResult[]> {
        return this.client
            .get<RestaurantResult[]>("restaurants/owner")
            .then((response) => response.data)
    }

    /**
     * Gets a list of restaurant menus
     * @param id - restaurant or alias
     */
    // TODO: support for alias
    async getMenus(id: string): Promise<MenuResult[]> {
        return this.client
            .get<MenuResult[]>(`/restaurants/${id}/menus`)
            .then((res) => res.data)
    }
}
