import { describe, expect, it } from "@jest/globals"
import { DefaultMenuHttpClient } from "../../src/client"
describe("DefaultMenuHttpClient", () => {
    describe("create", () => {
        it("should create an axios instance", () => {
            const apiKey = "WM.xxxxxxxx"
            const baseURL = "https://whatsamenu.core.wiredmartians.com/v1"
            const client = DefaultMenuHttpClient.create({
                baseURL,
                headers: {
                    "X-API-Key": apiKey
                }
            })

            expect(client).toBeTruthy()
            expect(client.defaults.headers).toMatchObject({
                "X-API-Key": apiKey
            })
            expect(client.defaults.baseURL).toBe(baseURL)
        })

        it.each([
            ["xx.xxxxx", "unexpected API Key token received: xx.xxxxx"],
            [undefined, "unexpected API Key token received: undefined"],
            ["", "unexpected API Key token received: "]
        ])(
            "should throw an error when API Key is %s",
            (key: string | undefined, expected: string) => {
                let error: Error | null = null
                const baseURL = "https://whatsamenu.core.wiredmartians.com/v1"
                try {
                    DefaultMenuHttpClient.create({
                        baseURL,
                        headers: {
                            "X-API-Key": key
                        }
                    })
                } catch (err) {
                    error = err as unknown as Error
                }

                expect(error).toBeTruthy()
                expect(error?.message).toBe(expected)
            }
        )

        it.each([
            [
                "mailto://mail@whatsamenu.core.wiredmartians.com/v1",
                "unexpected url provided as baseURL for axios: mailto://mail@whatsamenu.core.wiredmartians.com/v1"
            ],
            [
                undefined,
                "cannot create an axios client with an undefined baseURL: undefined"
            ],
            ["", "cannot create an axios client with an undefined baseURL: "]
        ])(
            "should throw an error when baseURL is invalid: %s",
            (baseURL: string | undefined, expected: string) => {
                let error: Error | null = null
                try {
                    DefaultMenuHttpClient.create({
                        baseURL,
                        headers: {
                            "X-API-Key": "WM.xxxxx"
                        }
                    })
                } catch (err) {
                    error = err as unknown as Error
                }

                expect(error).toBeTruthy()
                expect(error?.message).toBe(expected)
            }
        )
    })
})
