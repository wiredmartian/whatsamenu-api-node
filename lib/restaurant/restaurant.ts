import { AxiosInstance } from "axios"
import { RestaurantResult } from "./types"

export interface RestaurantRepository {
    getRestaurants(): Promise<Array<RestaurantResult>>
    getRestaurant(id: string): Promise<RestaurantResult>
    search(query: string, limit: number): Promise<RestaurantResult>
}

export class Restaurant implements RestaurantRepository {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    /**
     *
     * @param query - search term
     * @param limit - max results from search to return
     */
    async search(query: string, limit: number): Promise<RestaurantResult> {
        return this.client
            .get<RestaurantResult>(
                `/restaurants/search?query=${query}&limit=${limit}`
            )
            .then((response) => response.data)
    }

    /**
     * Gets a restaurant by Id
     * @param id - restaurant Id
     */
    async getRestaurant(id: string): Promise<RestaurantResult> {
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
