import { AxiosInstance } from "axios"
import { DateMetadata, ResponseMessage } from "../types"
import {
    CreateIngredientInput,
    createIngredientSchema,
    validator
} from "../schema"
import FD from "form-data"

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
     * @param data - FormData containing image file
     * @returns upload file path/url
     */
    async upload(id: number, data: FormData) {
        if (!data.get("fileData") === null) {
            throw new Error("form-data contains no required file data")
        }
        await validator.validateFormFile(
            data.get("fileData") as FormDataEntryValue
        )

        const form = new FormData()
        form.append("fileData", data.get("fileData") as FormDataEntryValue)

        return this.client
            .putForm<{ data: string }>(`/ingredients/${id}/upload`, form)
            .then((response) => response.data)
    }

    async uploadBuffer(id: number, buff: Buffer) {
        await validator.validateImageBuffer(buff)
        const form = new FD()
        form.append("fileData", buff)

        return this.client
            .putForm<{ data: string }>(`/ingredients/${id}/upload`, form)
            .then((response) => response.data)
    }
}
