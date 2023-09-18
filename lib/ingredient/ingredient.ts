import { DateMetadata } from "../types"

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
