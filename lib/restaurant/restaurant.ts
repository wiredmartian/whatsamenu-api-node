import { AxiosInstance } from "axios"
import { Address, ResponseMessage } from "../types"
import {
    CreateRestaurantInput,
    createRestaurantSchema,
    validator
} from "../schema"

/**
 * Restaurant API response type
 */
export type RestaurantResult = {
    /** unique identifier */
    restaurantId: string
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
}
