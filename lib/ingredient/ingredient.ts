import { AxiosInstance } from "axios"
import { DateMetadata, ResponseMessage } from "../types"
import {
    CreateIngredientInput,
    createIngredientSchema,
    validator
} from "../schema"
import { FormData } from "formdata-node"

export type IngredientResult = {
    /** ingredient id */
    ingredientId: string
    /** menu item id associated with ingredient */
    menuItemId: string
    /** ingredient name @example Tomato */
    name: string
    /** ingredient image url (NB: not complete url) */
    imageUrl: string
} & DateMetadata

export class Ingredient {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    /**
     * Updates a menu item ingredient
     * @param id - ingredient id
     * @param data - input data for updating an ingredient
     * @returns response message
     */
    async update(
        id: number,
        data: CreateIngredientInput
    ): Promise<ResponseMessage> {
        return validator
            .validateJsonSchema(createIngredientSchema, data)
            .then(() =>
                this.client
                    .put<ResponseMessage>(`/ingredients/${id}`, data)
                    .then((response) => response.data)
            )
    }

    /**
     * Marks an ingredient menu item for deletion
     * @param id - ingredient id
     * @returns a response message
     */
    async delete(id: number): Promise<ResponseMessage> {
        return this.client
            .delete<ResponseMessage>(`/ingredients/${id}`)
            .then((response) => response.data)
    }

    /**
     * Uploads an ingredient image
     * @param id - ingredient id
     * @param image - Image file
     * @returns upload file path/url
     */
    async upload(id: number, image: Blob) {
        const form = new FormData()
        await validator.validateFormFile(image)
        form.append("fileData", image)
        return this.client
            .putForm<{ data: string }>(`/ingredients/${id}/upload`, form)
            .then((response) => response.data)
    }
}
