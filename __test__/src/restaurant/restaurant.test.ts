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
import { Restaurant } from "../../../src/restaurant"
import { CreateRestaurantInput } from "../../../src/schema"
import { Province, ResponseMessage } from "../../../src/types"
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

    describe("GET /restaurants/{alias}/alias", () => {
        const alias = "Dukkah-Durban"
        const endpoint = `/restaurants/${alias}/alias`

        it.each([
            [
                "dukkah durban",
                "alias must not contain special characters: dukkah durban"
            ],
            [
                "Florida's kitchen",
                "alias must not contain special characters: Florida's kitchen"
            ],
            [
                "Boys & Boys",
                "alias must not contain special characters: Boys & Boys"
            ]
        ])(
            "should throw error when alias has special characters: %s",
            async (input: string, expected: string) => {
                let error: Error | null = null
                try {
                    await repository.getRestaurantByAlias(input)
                } catch (err) {
                    error = err as Error
                }
                expect(error).toBeTruthy()
                expect(error?.message).toBe(expected)
            }
        )
        it("should make a successful request", async () => {
            jest.spyOn(axiosMock, "get").mockResolvedValue({
                data
            })
            const actual = await repository.getRestaurantByAlias(alias)

            expect(actual).toEqual(data)
            expect(axiosMock.get).toHaveBeenCalledWith(endpoint.toLowerCase())
        })

        it("should throw error when request was rejected", async () => {
            jest.spyOn(axiosMock, "get").mockImplementation(() => {
                throw new Error("failed to complete request")
            })
            const [actual] = await Promise.allSettled([
                repository.getRestaurantByAlias(alias)
            ])
            expect(axiosMock.get).toHaveBeenCalledWith(endpoint.toLowerCase())
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
                await repository.create(invalidInput)
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
            const actual = await repository.create(validInput)

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
                await repository.update(15, invalidInput)
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
            const actual = await repository.update(15, validInput)

            // Assert
            expect(axiosMock.put).toHaveBeenCalledWith(endpoint, validInput)
            expect(actual).toEqual(expected)
        })
    })

    describe("POST /restaurants/near-me", () => {
        const endpoint = "/restaurants/near-me"

        it("should throw a validation error when coordinates are out of range", async () => {
            let error: Error | null = null
            try {
                const input = {
                    latitude: -100.182737,
                    longitude: 19.1928373,
                    radius: 10
                }
                await repository.getNearMe(input)
            } catch (err) {
                error = err as unknown as Error
            }

            expect(error?.message).toBe("GPS coordinates out of range")
        })

        it("should throw a validation error when coordinates are invalid", async () => {
            let error: Error | null = null
            try {
                const input = {
                    latitude: "hello",
                    longitude: 19.1928373,
                    radius: 10
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await repository.getNearMe(input as any)
            } catch (err) {
                error = err as unknown as Error
            }

            expect(error?.message).toBe("invalid GPS coordinates")
        })

        it("should execute request successfully and return a result", async () => {
            jest.spyOn(axiosMock, "post").mockResolvedValue({
                data: [data]
            })
            const input = {
                latitude: -32.182737,
                longitude: 19.1928373,
                radius: 10
            }
            const actual = await repository.getNearMe(input)

            expect(actual).toEqual([data])
            expect(axiosMock.post).toHaveBeenCalledWith(endpoint, input)
        })
    })
})
