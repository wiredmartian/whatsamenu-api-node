import { AxiosInstance } from "axios"
import { MenuGroupResult } from "../menugroup"
import { ResponseMessage } from "../types"
import {
    CreateMenuGroupInput,
    createMenuGroupSchema
} from "../schema/menu-schema"
import { validator } from "../schema"

export type MenuResult = {
    /** menu id */
    menuId: string
    /** restaurant id associated to menu */
    restaurantId: string
    /** menu name @example Kids Menu */
    name: string
    /** short menu summary */
    summary: string
    /** menu categories */
    menuGroups: Array<MenuGroupResult>
}

export class Menu {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    /**
     * Gets a full menu which includes categories and menu items
     * @param menuId - menu id
     * @returns a full restaurant menu
     */
    async getMenu(menuId: number): Promise<Array<MenuResult>> {
        return this.client
            .get<Array<MenuResult>>(`/menu/${menuId}`)
            .then((response) => response.data)
    }

    /**
     * Marks a menu for deletion
     * @param menuId - menu id
     * @returns a response message
     */
    async delete(menuId: number): Promise<ResponseMessage> {
        return this.client
            .delete<ResponseMessage>(`/menu/${menuId}`)
            .then((response) => response.data)
    }

    /**
     * Create a menu category/section
     * @param menuId - menu id
     * @param data - menu group input data
     * @returns response message
     */
    async createMenuGroup(menuId: number, data: CreateMenuGroupInput) {
        return validator
            .validateJsonSchema(createMenuGroupSchema, data)
            .then(() =>
                this.client
                    .post<ResponseMessage>(`/menu/${menuId}/menu-group`, data)
                    .then((response) => response.data)
            )
    }

    /**
     * Get all menu groups for a menu
     * @param menuId - menu id
     * @returns menu groups (categories) belong to menu specified
     */
    async getMenuGroups(menuId: number): Promise<MenuGroupResult> {
        return this.client
            .get<MenuGroupResult>(`/menu/${menuId}/menu-groups`)
            .then((response) => response.data)
    }
}
