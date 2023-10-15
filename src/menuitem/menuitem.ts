import { AxiosInstance } from "axios"
import { IngredientResult } from "../ingredient"
import { DateMetadata, ResponseMessage } from "../types"
import { CreateMenuItemInput, createMenuItemSchema, validator } from "../schema"
import { AllergenResult } from "../allergen"
import { FormData } from "formdata-node"

export type MenuItemResult = {
    /** menu item id */
    menuItemId: string
    /** menu group id associated with menu item */
    menuGroupId: string
    /** menu id associated to menu group */
    menuId: string
    /** menu item name @example Pasta */
    name: string
    /** short summary of the menu item */
    summary: string
    /** broad description of the menu item */
    description: string
    /** menu item image (not a complete url) @example "public/ingredients/1-40a1afc36b3ee3a9d4164c3c0dc3ded5.png" */
    imageUrl: string
    /** menu item cost price */
    price: string
    /** ingredients used to make the item */
    ingredients: Array<IngredientResult> | null
} & DateMetadata

export class MenuItem {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    /**
     * Gets a menu item by id
     * @param menuItemId - menu item id
     * @returns a menu item
     */
    async getMenuItem(id: number): Promise<MenuItemResult> {
        return this.client
            .get<MenuItemResult>(`/menu-item/${id}`)
            .then((response) => response.data)
    }

    /**
     * Updates a menu group's menu item
     * @param id - menu item id
     * @param data - menu item update input
     * @returns a response message
     */
    async update(
        id: number,
        data: CreateMenuItemInput
    ): Promise<ResponseMessage> {
        return validator
            .validateJsonSchema(createMenuItemSchema, data)
            .then(() =>
                this.client
                    .put<ResponseMessage>(`/menu-item/${id}`, data)
                    .then((response) => response.data)
            )
    }

    /**
     * Marks a menu item for deletion
     * @param id - menu item id
     * @returns a response message
     */
    async delete(id: number): Promise<ResponseMessage> {
        return this.client
            .delete<ResponseMessage>(`/menu-item/${id}`)
            .then((response) => response.data)
    }

    /**
     * Adds an allergen to menu item
     * @param id - menu item id
     * @param data - allergen input
     * @returns response message
     * @example const result = await addAllergen(3 { allergenId: "54" })
     */
    async addAllergen(
        id: number,
        data: { allergenId: string }
    ): Promise<ResponseMessage> {
        return this.client
            .post<ResponseMessage>(`/menu-item/${id}/allergens`, data)
            .then((response) => response.data)
    }

    /**
     * Gets a list of all menu item allergens
     * @param id - menu item id
     * @returns a list of allergens
     */
    async getAllergens(id: number): Promise<AllergenResult[]> {
        return this.client
            .get<AllergenResult[]>(`/menu-item/${id}/allergens`)
            .then((response) => response.data)
    }

    /**
     * Deletes a menu item allergen
     * @param menuItemId - menu item id
     * @param allergenId - menu item allergen id
     * @returns response message
     */
    async deleteAllergen(menuItemId: number, allergenId: number) {
        return this.client
            .delete<ResponseMessage>(
                `/menu-item/${menuItemId}/allergens/${allergenId}`
            )
            .then((response) => response.data)
    }

    /**
     * Uploads a menu item display image
     * @param id - menu item id
     * @param image - display image blob
     * @returns an image path
     */
    async upload(id: number, image: Blob) {
        const form = new FormData()
        await validator.validateFormFile(image)
        form.append("fileData", image)
        return this.client
            .putForm<{ data: string }>(`menu-item/${id}/upload`, form)
            .then((response) => response.data)
    }
}
