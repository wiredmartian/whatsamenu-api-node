import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals"
import axios from "axios"
import { MenuGroup } from "../../../src/menugroup"
import { CreateMenuGroupInput, CreateMenuItemInput } from "../../../src/schema"
jest.mock("axios")

const axiosMock = jest.mocked(axios, { shallow: true })
let menugroup: MenuGroup

describe("MenuGroup", () => {
    beforeEach(() => {
        menugroup = new MenuGroup(axiosMock)
    })
    afterEach(() => {
        axiosMock.mockClear()
        axiosMock.mockReset()
    })

    describe("POST /menu-group/{id}/menu-items", () => {
        const menuGroupId = 19
        it("should create a menu item under menu group", async () => {
            const input: CreateMenuItemInput = {
                name: "Burger",
                summary: "Migty burger",
                price: 150
            }
            const spy = jest.spyOn(axiosMock, "post").mockResolvedValue({
                data: { message: "menu item created" }
            })
            const actual = await menugroup.createMenuItem(menuGroupId, input)

            expect(actual).toEqual({ message: "menu item created" })
            expect(axiosMock.post).toHaveBeenCalledWith(
                `/menu-group/${menuGroupId}/menu-items`,
                input
            )
            spy.mockClear()
        })

        it("should fail schema validation", async () => {
            const input = {
                summary: "Migty burger",
                price: 150
            }
            const expected = [
                {
                    instancePath: "",
                    keyword: "required",
                    message: "must have required property 'name'",
                    params: {
                        missingProperty: "name"
                    },
                    schemaPath: "#/required"
                }
            ]
            let error: Error | null = null

            try {
                await menugroup.createMenuItem(menuGroupId, input as never)
            } catch (err) {
                error = err as Error
            }

            expect(error).toEqual(expected)
            expect(axiosMock.post).not.toHaveBeenCalled()
        })
    })

    describe("PUT /menu-group/{id}", () => {
        const menuGroupId = 19
        it("should create update menu group", async () => {
            const input: CreateMenuGroupInput = {
                name: "Sides",
                summary: "All the sides you can eat"
            }
            const spy = jest.spyOn(axiosMock, "put").mockResolvedValue({
                data: { message: "menu item updated" }
            })
            const actual = await menugroup.update(menuGroupId, input)

            expect(actual).toEqual({ message: "menu item updated" })
            expect(axiosMock.put).toHaveBeenCalledWith(
                `/menu-group/${menuGroupId}`,
                input
            )
            spy.mockClear()
        })

        it("should fail schema validation", async () => {
            const input = {
                summary: "Migty burger",
                price: 150
            }
            const expected = [
                {
                    instancePath: "",
                    keyword: "required",
                    message: "must have required property 'name'",
                    params: {
                        missingProperty: "name"
                    },
                    schemaPath: "#/required"
                }
            ]
            let error: Error | null = null

            try {
                await menugroup.createMenuItem(menuGroupId, input as never)
            } catch (err) {
                error = err as Error
            }

            expect(error).toEqual(expected)
            expect(axiosMock.post).not.toHaveBeenCalled()
        })
    })
})
