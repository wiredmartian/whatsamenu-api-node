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
import { CreateRestaurantInput } from "../../../lib/schema"
import { Province, ResponseMessage } from "../../../lib/types"
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

    describe("POST /restaurants", () => {
        const endpoint = `/restaurants`

        const validInput: CreateRestaurantInput = {
            name: "Bird n Co",
            summary: "Finest in the land",
            line1: "11 Florida Road",
            line2: "Morningside",
            city: "Durban",
            state: Province.KWAZULU_NATAL,
            country: "South Africa",
            latitude: 12.088,
            longitude: 12.088
        }

        it("should return validation errors from schema", async () => {
            // Arrange
            const invalidInput: CreateRestaurantInput = {
                ...validInput,
                state: "KwaZulu-Natal" as Province
            }
            const expected = [
                {
                    instancePath: "/state",
                    schemaPath: "#/properties/state/enum",
                    keyword: "enum",
                    params: { allowedValues: Object.keys(Province) },
                    message: "must be equal to one of the allowed values"
                }
            ]

            // Act
            let errorResult
            try {
                await repository.createRestaurant(invalidInput)
            } catch (err) {
                errorResult = err
            }

            // Assert
            expect(axiosMock.post).not.toHaveBeenCalled()
            expect(errorResult).toEqual(expected)
        })

        it("should create a restaurant and return a success message", async () => {
            // Arrange
            const expected: ResponseMessage = {
                message: "restaurant created"
            }
            jest.spyOn(axiosMock, "post").mockResolvedValue({
                data: {
                    message: "restaurant created"
                }
            })

            // Act
            const actual = await repository.createRestaurant(validInput)

            // Assert
            expect(axiosMock.post).toHaveBeenCalledWith(endpoint, validInput)
            expect(actual).toEqual(expected)
        })
    })

    describe("PUT /restaurants/{id}", () => {
        const endpoint = `/restaurants/15`

        const validInput: CreateRestaurantInput = {
            name: "Bird n Co",
            summary: "Finest in the land",
            line1: "11 Florida Road",
            line2: "Morningside",
            city: "Durban",
            state: Province.KWAZULU_NATAL,
            country: "South Africa",
            latitude: 12.0880128,
            longitude: 12.0887238
        }

        it("should return validation errors from schema", async () => {
            // Arrange
            const invalidInput: CreateRestaurantInput = {
                ...validInput,
                name: "",
                city: ""
            }
            const expected = [
                {
                    instancePath: "/city",
                    schemaPath: "#/properties/city/minLength",
                    keyword: "minLength",
                    params: { limit: 1 },
                    message: "must NOT have fewer than 1 characters"
                },
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
                await repository.updateRestaurant(15, invalidInput)
            } catch (err) {
                errorResult = err
            }

            // Assert
            expect(axiosMock.put).not.toHaveBeenCalled()
            expect(errorResult).toEqual(expected)
        })

        it("should update a restaurant and return a success message", async () => {
            // Arrange
            const expected: ResponseMessage = {
                message: "restaurant updated"
            }
            jest.spyOn(axiosMock, "put").mockResolvedValue({
                data: {
                    message: "restaurant updated"
                }
            })

            // Act
            const actual = await repository.updateRestaurant(15, validInput)

            // Assert
            expect(axiosMock.put).toHaveBeenCalledWith(endpoint, validInput)
            expect(actual).toEqual(expected)
        })
    })
})
