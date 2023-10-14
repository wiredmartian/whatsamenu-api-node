import { AxiosInstance } from "axios"
import { DateMetadata } from "../types"

export type AllergenResult = {
    /** allergen unique identifier */
    allergenId: string
    /** allergen name @example Wheat */
    name: string
    /** short description summary  */
    summary: string
} & DateMetadata

export class Allergen {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    /**
     * Gets a list of all allergens
     * @returns list of allergens
     */
    async getAllergens(): Promise<Array<AllergenResult>> {
        return this.client
            .get<Array<AllergenResult>>("/allergens")
            .then((response) => response.data)
    }

    /**
     * Gets an allergen by it's id
     * @returns a single allergen
     */
    async getAllergen(allergenId: number): Promise<AllergenResult> {
        return this.client
            .get<AllergenResult>(`/allergens/${allergenId}`)
            .then((response) => response.data)
    }
}
