import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals"
import axios from "axios"
import { Allergen, AllergenResult } from "../../../src/allergen"
jest.mock("axios")

const axiosMock = jest.mocked(axios, { shallow: true })
let repository: Allergen

describe("Allergen", () => {
    const data: AllergenResult = {
        allergenId: "2",
        name: "Nuts",
        summary: "Nuts",
        updated: "2022-03-06 17:45:33",
        created: "2022-03-06 17:45:33"
    }
    beforeEach(() => {
        repository = new Allergen(axiosMock)
        jest.spyOn(global.console, "error").mockImplementation(() => {})
    })
    afterEach(() => {
        axiosMock.mockClear()
        axiosMock.mockReset()
    })

    describe("GET /allergens/{id}", () => {
        const allergenId = 123
        const endpoint = `/allergens/${allergenId}`
        it("should make a successful request", async () => {
            jest.spyOn(axiosMock, "get").mockResolvedValue({
                data
            })
            const actual = await repository.getAllergen(allergenId)

            expect(actual).toEqual(data)
            expect(axiosMock.get).toHaveBeenCalledWith(endpoint)
        })
    })

    describe("GET /allergens", () => {
        const endpoint = `/allergens`
        it("should make a successful request", async () => {
            jest.spyOn(axiosMock, "get").mockResolvedValue({
                data: [data]
            })
            const actual = await repository.getAllergens()

            expect(actual).toEqual([data])
            expect(axiosMock.get).toHaveBeenCalledWith(endpoint)
        })
    })
})
