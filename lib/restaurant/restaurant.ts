import { AxiosInstance } from "axios"
import { Address } from "../types"

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
     *
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
     * Gets a restaurant by Id
     * @param id - restaurant Id
     */
    async getRestaurant(id: number): Promise<RestaurantResult> {
        return this.client
            .get<RestaurantResult>(`/restaurants/${id}`)
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
}
