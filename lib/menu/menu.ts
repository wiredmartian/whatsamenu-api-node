import { AxiosInstance } from "axios"
import { MenuGroupResult } from "../menugroup"

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
    async getMenu(menuId: string): Promise<Array<MenuResult>> {
        return this.client
            .get<Array<MenuResult>>(`/menu/${menuId}`)
            .then((response) => response.data)
    }
}
