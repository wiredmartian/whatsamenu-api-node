import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals"
import axios from "axios"
import fs from "fs"
import { Ingredient } from "../../../lib/ingredient"
import { CreateIngredientInput, validator } from "../../../lib/schema"
jest.mock("axios")

const axiosMock = jest.mocked(axios, { shallow: true })
let ingredient: Ingredient

describe("Ingredients", () => {
    beforeEach(() => {
        ingredient = new Ingredient(axiosMock)
    })
    afterEach(() => {
        axiosMock.mockClear()
        axiosMock.mockReset()
    })

    describe("DELETE /ingredients/{id}", () => {
        it("should delete an ingredient", async () => {
            jest.spyOn(axiosMock, "delete").mockResolvedValue({
                data: { message: "ingredient removed" }
            })
            const actual = await ingredient.delete(19)

            expect(actual).toEqual({ message: "ingredient removed" })
            expect(axiosMock.delete).toHaveBeenCalledWith(`/ingredients/19`)
        })
    })

    describe("PUT /ingredients/{id}", () => {
        const endpoint = `/ingredients/21`
        const validInput: CreateIngredientInput = {
            name: "Cheese",
            menuItemId: 1234
        }
        it("should return validation errors", async () => {
            // Arrange
            const invalidInput: CreateIngredientInput = {
                ...validInput,
                name: ""
            }
            const expected = [
                {
                    instancePath: "/name",
                    schemaPath: "#/properties/name/minLength",
                    keyword: "minLength",
                    params: { limit: 1 },
                    message: "must NOT have fewer than 1 characters"
                }
            ]

            // Act
            let errorResult
            try {
                await ingredient.update(21, invalidInput)
            } catch (err) {
                errorResult = err
            }

            // Assert
            expect(axiosMock.put).not.toHaveBeenCalled()
            expect(errorResult).toEqual(expected)
        })
        it("should update ingredient successfully", async () => {
            jest.spyOn(axiosMock, "put").mockResolvedValue({
                data: { message: "ingredient updated" }
            })
            const actual = await ingredient.update(21, validInput)

            expect(actual).toEqual({ message: "ingredient updated" })
            expect(axiosMock.put).toHaveBeenCalledWith(endpoint, validInput)
        })
    })

    describe("PUT /ingredients/{id}/upload", () => {
        const imagePath = "__test__/__assets__/kota.jpeg"
        const buffer = fs.readFileSync(imagePath)
        it("should successfully upload an image", async () => {
            jest.spyOn(validator, "validateFormFile").mockResolvedValue()
            jest.spyOn(axiosMock, "putForm").mockResolvedValue({
                data: {
                    data: "public/ingredients/12-b2a7f1c6be9edf1ac591c123b6ed2f90.jpg"
                }
            })

            const actual = await ingredient.upload(
                12,
                new Blob([buffer], { type: "image/jpeg" })
            )

            expect(actual).toEqual({
                data: "public/ingredients/12-b2a7f1c6be9edf1ac591c123b6ed2f90.jpg"
            })
        })
    })
})
