import { MenuItemResult } from "../menuitem"
import { DateMetadata } from "../types"

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
    items: Array<MenuItemResult>
} & DateMetadata
