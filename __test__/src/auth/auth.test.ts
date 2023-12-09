import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals"
import axios from "axios"
import { ApiKey, Auth } from "../../../src/auth"
import { ResetPasswordInput } from "../../../src/schema"
import { ResponseMessage } from "../../../src/types"
jest.mock("axios")

const axiosMock = jest.mocked(axios, { shallow: true })
let user: Auth

describe("Auth", () => {
    beforeEach(() => {
        user = new Auth(axiosMock)
    })
    afterEach(() => {
        axiosMock.mockClear()
        axiosMock.mockReset()
    })

    describe("Manage API keys", () => {
        describe("GET /auth/api-keys", () => {
            it("should successfully get api keys", async () => {
                const expected: ApiKey[] = [
                    {
                        name: "",
                        keyAlias: "df6088dc-be04-4c9f-95d4-cf3ee0cbac63",
                        userId: "18",
                        status: "ENABLED"
                    },
                    {
                        name: "my website",
                        keyAlias: "f2124c83-489c-498c-8f02-373ebb9e4dc1",
                        userId: "18",
                        status: "DISABLED"
                    }
                ]

                jest.spyOn(axiosMock, "get").mockResolvedValueOnce({
                    data: expected
                })

                const actual = await user.getApiKeys()

                expect(actual).toEqual(expected)
                expect(axiosMock.get).toHaveBeenCalledWith("/auth/api-keys")
            })

            it("should return empty array when no api keys found", async () => {
                const expected: ApiKey[] = []

                jest.spyOn(axiosMock, "get").mockResolvedValueOnce({
                    data: expected
                })

                const actual = await user.getApiKeys()

                expect(actual).toEqual(expected)
                expect(axiosMock.get).toHaveBeenCalledWith("/auth/api-keys")
            })
        })

        describe("GET /auth/api-keys/{keyAlias}", () => {
            it("should successfully get api key by key alias", async () => {
                const expected: ApiKey = {
                    name: "",
                    keyAlias: "df6088dc-be04-4c9f-95d4-cf3ee0cbac63",
                    userId: "18",
                    status: "ENABLED"
                }

                jest.spyOn(axiosMock, "get").mockResolvedValueOnce({
                    data: expected
                })

                const actual = await user.getApiKey(
                    "df6088dc-be04-4c9f-95d4-cf3ee0cbac63"
                )

                expect(actual).toEqual(expected)
                expect(axiosMock.get).toHaveBeenCalledWith(
                    "/auth/api-keys/df6088dc-be04-4c9f-95d4-cf3ee0cbac63"
                )
            })

            it("should return 404 when api key not found", async () => {
                const expected = {
                    response: {
                        status: 404,
                        data: {
                            error: "API key not found"
                        }
                    }
                }

                jest.spyOn(axiosMock, "get").mockRejectedValueOnce(expected)

                let error
                try {
                    await user.getApiKey("df6088dc-be04-4c9f-95d4-cf3ee0cbac63")
                } catch (err) {
                    error = err as unknown
                }

                expect(error).toEqual(expected)
                expect(axiosMock.get).toHaveBeenCalledWith(
                    "/auth/api-keys/df6088dc-be04-4c9f-95d4-cf3ee0cbac63"
                )
            })
        })

        describe("PATCH /auth/api-keys/{alias}", () => {
            it("should successfully update api key", async () => {
                const params = {
                    name: "my website",
                    status: "ENABLE"
                }
                const expected: ApiKey = {
                    name: "my website",
                    keyAlias: "df6088dc-be04-4c9f-95d4-cf3ee0cbac63",
                    userId: "18",
                    status: "ENABLED"
                }

                jest.spyOn(axiosMock, "patch").mockResolvedValueOnce({
                    data: expected
                })

                const actual = await user.updateApiKey(
                    "df6088dc-be04-4c9f-95d4-cf3ee0cbac63",
                    { name: "my website", status: "ENABLE" }
                )

                expect(actual).toEqual(expected)
                expect(axiosMock.patch).toHaveBeenCalledWith(
                    "/auth/api-keys/df6088dc-be04-4c9f-95d4-cf3ee0cbac63",
                    params
                )
            })

            it("should return 404 when api key not found", async () => {
                const input = {
                    name: "my website",
                    status: "ENABLE"
                }
                const expected = {
                    response: {
                        status: 404,
                        data: {
                            error: "API key not found"
                        }
                    }
                }

                jest.spyOn(axiosMock, "patch").mockRejectedValueOnce(expected)

                let error
                try {
                    await user.updateApiKey(
                        "df6088dc-be04-4c9f-95d4-cf3ee0cbac63",
                        {
                            name: "my website",
                            status: "ENABLE"
                        }
                    )
                } catch (err) {
                    error = err as unknown
                }

                expect(error).toEqual(expected)
                expect(axiosMock.patch).toHaveBeenCalledWith(
                    "/auth/api-keys/df6088dc-be04-4c9f-95d4-cf3ee0cbac63",
                    input
                )
            })
        })
    })
    describe("POST /auth/forgot-password", () => {
        it("should successfully send a forgot password request", async () => {
            const input = "bob@gmail.com"
            const expected: ResponseMessage = {
                message: "A One Time Pin has been sent to your email"
            }
            const spy = jest.spyOn(axiosMock, "post").mockResolvedValueOnce({
                data: { message: "A One Time Pin has been sent to your email" }
            })

            const actual = await user.forgotPassword(input)

            expect(actual).toEqual(expected)
            expect(axiosMock.post).toHaveBeenCalledWith(
                "/auth/forgot-password",
                input
            )
            spy.mockClear()
        })
    })

    describe("POST /auth/reset-password", () => {
        it("should successfully reset password", async () => {
            const input: ResetPasswordInput = {
                email: "bob@gmail.com",
                password: "@Bob1234",
                otp: "862731"
            }
            const expected: ResponseMessage = {
                message: "Password reset successful"
            }
            const spy = jest.spyOn(axiosMock, "post").mockResolvedValueOnce({
                data: { message: "Password reset successful" }
            })

            const actual = await user.resetPassword(input)

            expect(actual).toEqual(expected)
            expect(axiosMock.post).toHaveBeenCalledWith(
                "/auth/reset-password",
                input
            )
            spy.mockClear()
        })

        const weakPasswords = [
            ["Pass", "must be at least 8 characters long"],
            ["password", "must contain at least 1 uppercase letter"],
            ["PASSWORD", "must contain at least 1 lowercase letter"],
            ["Password", "must contain at least 1 number"],
            [
                "Passw0rd",
                "must contain at least 1 special character: `-+_!@#$%^&*.,?`"
            ]
        ]
        it.each(weakPasswords)(
            "should fail when password is weak",
            async (password, message) => {
                const input: ResetPasswordInput = {
                    email: "bob@gmail.com",
                    password,
                    otp: "1368052"
                }

                let error: Error | null = null
                try {
                    await user.resetPassword(input)
                } catch (err) {
                    error = err as unknown as Error
                }

                expect(error?.message).toEqual(message)
                expect(axiosMock.post).not.toHaveBeenCalled()
            }
        )
    })
})
