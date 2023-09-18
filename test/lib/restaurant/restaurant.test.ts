import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals"
import axios from "axios"
import { _restaurant_test_data } from "../../__data__/_restaurant"
import { Restaurant } from "../../../lib/restaurant"
jest.mock("axios")

const axiosMock = jest.mocked(axios, { shallow: true })
let repository: Restaurant

describe("Restaurant", () => {
    const data = _restaurant_test_data
    beforeEach(() => {
        repository = new Restaurant(axiosMock)
        jest.spyOn(global.console, "error").mockImplementation(() => {})
    })
    afterEach(() => {
        axiosMock.mockClear()
        axiosMock.mockReset()
    })

    describe("GET /restaurants/{id}", () => {
        const restaurantId = 123
        const endpoint = `/restaurants/${restaurantId}`
        it("should make a successful request", async () => {
            jest.spyOn(axiosMock, "get").mockResolvedValue({
                data
            })
            const actual = await repository.getRestaurant(restaurantId)

            expect(actual).toEqual(data)
            expect(axiosMock.get).toHaveBeenCalledWith(endpoint)
        })

        it("should throw error when request was rejected", async () => {
            jest.spyOn(axiosMock, "get").mockImplementation(() => {
                throw new Error("failed to complete request")
            })
            const [actual] = await Promise.allSettled([
                repository.getRestaurant(restaurantId)
            ])
            expect(axiosMock.get).toHaveBeenCalledWith(endpoint)
            expect(axios.get).toThrow("failed to complete request")
            expect(actual.status).toBe("rejected")
        })
    })

    describe("GET /restaurants", () => {
        const endpoint = `/restaurants`
        it("should make a successful request", async () => {
            jest.spyOn(axiosMock, "get").mockResolvedValue({
                data: [data]
            })
            const actual = await repository.getRestaurants()

            expect(actual).toEqual([data])
            expect(axiosMock.get).toHaveBeenCalledWith(endpoint)
        })

        it("should throw error when request was rejected", async () => {
            jest.spyOn(axiosMock, "get").mockImplementation(() => {
                throw new Error("failed to complete request")
            })
            const [actual] = await Promise.allSettled([
                repository.getRestaurants()
            ])
            expect(axiosMock.get).toHaveBeenCalledWith(endpoint)
            expect(actual.status).toBe("rejected")
        })
    })
})
