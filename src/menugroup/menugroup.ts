import { AxiosInstance } from "axios"
import { MenuItemResult } from "../menuitem"
import { DateMetadata, ResponseMessage } from "../types"
import {
    CreateMenuGroupInput,
    CreateMenuItemInput,
    createMenuGroupSchema,
    createMenuItemSchema,
    validator
} from "../schema"

export type MenuGroupResult = {
    /** menu group id */
    menuGroupId: string
    /** menu id associated to menu group */
    menuId: string
    /** menu group name @example Starters */
    name: string
    /** short menu group summary */
    summary: string
    /** menu group category items */
    items: Array<MenuItemResult> | null
} & DateMetadata

export class MenuGroup {
    private client: AxiosInstance

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient
    }

    /**
     * Creates a menu item under specified menu group
     * @param menuGroupId - menu group id
     * @returns a response message
     */
    async create(
        menuGroupId: number,
        data: CreateMenuItemInput
    ): Promise<ResponseMessage> {
        return validator
            .validateJsonSchema(createMenuItemSchema, data)
            .then(() =>
                this.client
                    .post<ResponseMessage>(
                        `/menu-group/${menuGroupId}/menu-items`,
                        data
                    )
                    .then((response) => response.data)
            )
    }

    /**
     * Updates a menu group
     * @param menuGroupId - menu group id
     * @param data - update menu group input data
     * @returns a response message
     */
    async update(
        menuGroupId: number,
        data: CreateMenuGroupInput
    ): Promise<ResponseMessage> {
        return validator
            .validateJsonSchema(createMenuGroupSchema, data)
            .then(() =>
                this.client
                    .put<ResponseMessage>(`/menu-group/${menuGroupId}`, data)
                    .then((response) => response.data)
            )
    }

    /**
     * Marks a menu group for deletion
     *
     * This is a cascading delete which includes all its children (menu items, ingredients)
     * @param menuGroupId - menu group id
     * @returns a response message
     */
    async delete(menuGroupId: number): Promise<ResponseMessage> {
        return this.client
            .delete<ResponseMessage>(`/menu-group/${menuGroupId}`)
            .then((response) => response.data)
    }

    /**
     * Gets all menu items under a menu group
     * @param menuGroupId - menu group id
     * @returns menu items in a group
     */
    async getMenuItems(menuGroupId: number): Promise<Array<MenuItemResult>> {
        return this.client
            .get<Array<MenuItemResult>>(`/menu-group/${menuGroupId}/menu-items`)
            .then((response) => response.data)
    }
}
