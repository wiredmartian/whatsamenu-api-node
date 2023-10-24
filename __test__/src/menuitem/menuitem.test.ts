import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals"
import axios from "axios"
import {
    MenuItem,
    MenuItemAllergenResult,
    MenuItemResult
} from "../../../src/menuitem"
import { CreateMenuItemInput } from "../../../src/schema"
jest.mock("axios")

const axiosMock = jest.mocked(axios, { shallow: true })
let menuitem: MenuItem

describe("MenuItem", () => {
    const menuItemId = 19
    const menuitemData: MenuItemResult = {
        menuItemId: "7",
        menuId: "2",
        menuGroupId: "7",
        name: "Butternut Soup",
        summary: "Butter baked, fresh thyme, Dukkah brittle & herbed ciabatta",
        description:
            "Butter baked, fresh thyme, Dukkah brittle & herbed ciabatta",
        imageUrl: "",
        price: "90",
        ingredients: [],
        updated: "2023-04-02 16:06:20",
        created: "2023-04-02 16:06:20"
    }
    beforeEach(() => {
        menuitem = new MenuItem(axiosMock)
    })
    afterEach(() => {
        axiosMock.mockClear()
        axiosMock.mockReset()
    })

    describe("GET /menu-item/{id}", () => {
        it("should successfully get a menu item", async () => {
            const expected = menuitemData
            const spy = jest.spyOn(axiosMock, "get").mockResolvedValue({
                data: menuitemData
            })
            const actual = await menuitem.getMenuItem(menuItemId)

            expect(actual).toEqual(expected)
            expect(axiosMock.get).toHaveBeenCalledWith(
                `/menu-item/${menuItemId}`
            )
            spy.mockClear()
        })
    })

    describe("PUT /menu-item/{id}", () => {
        it("should update menu group", async () => {
            const input: CreateMenuItemInput = {
                name: "Burger",
                summary: "The best burger around",
                price: 100,
                allergens: ["8", "23"],
                description: "Truely awesome burger and so on and on"
            }
            const spy = jest.spyOn(axiosMock, "put").mockResolvedValue({
                data: { message: "menu item updated" }
            })
            const actual = await menuitem.update(menuItemId, input)

            expect(actual).toEqual({ message: "menu item updated" })
            expect(axiosMock.put).toHaveBeenCalledWith(
                `/menu-item/${menuItemId}`,
                input
            )
            spy.mockClear()
        })
    })

    describe("DELETE /menu-item/{id}", () => {
        it("should delete a menu item", async () => {
            const spy = jest.spyOn(axiosMock, "delete").mockResolvedValue({
                data: { message: "menu item removed" }
            })
            const actual = await menuitem.delete(menuItemId)

            expect(actual).toEqual({ message: "menu item removed" })
            expect(axiosMock.delete).toHaveBeenCalledWith(
                `/menu-item/${menuItemId}`
            )
            spy.mockClear()
        })
    })

    describe("POST /menu-item/{id}/allergens", () => {
        it("should create a menu item allergen", async () => {
            const allergenId = "18"
            const spy = jest.spyOn(axiosMock, "post").mockResolvedValue({
                data: { message: "allergen added" }
            })
            const actual = await menuitem.addAllergen(menuItemId, {
                allergenId
            })

            expect(actual).toEqual({ message: "allergen added" })
            expect(axiosMock.post).toHaveBeenCalledWith(
                `/menu-item/${menuItemId}/allergens`,
                { allergenId }
            )
            spy.mockClear()
        })
    })

    describe("GET /menu-item/{id}/allergens", () => {
        const allergens: MenuItemAllergenResult[] = [
            {
                allergenId: "2",
                menuItemId: "48",
                name: "Eggs",
                summary: "contains eggs",
                updated: "",
                created: ""
            }
        ]
        it("should get all menu item allergens", async () => {
            const spy = jest.spyOn(axiosMock, "get").mockResolvedValue({
                data: allergens
            })
            const actual = await menuitem.getAllergens(menuItemId)

            expect(actual).toEqual(allergens)
            expect(axiosMock.get).toHaveBeenCalledWith(
                `/menu-item/${menuItemId}/allergens`
            )
            spy.mockClear()
        })
    })
})
