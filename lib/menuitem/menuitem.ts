import { IngredientResult } from "../ingredient"
import { DateMetadata } from "../types"

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
