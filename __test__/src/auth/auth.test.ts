import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals"
import axios from "axios"
import { Auth } from "../../../src/auth"
import { CreateUserInput, ResetPasswordInput } from "../../../src/schema"
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

    describe("POST /auth/sign-up", () => {
        it("should not make request when input fails schema validation", async () => {
            const expected = [
                {
                    instancePath: "/password",
                    schemaPath: "#/properties/password/minLength",
                    keyword: "minLength",
                    params: { limit: 8 },
                    message: "must NOT have fewer than 8 characters"
                }
            ]

            let error
            try {
                await user.signUp({
                    email: "hib@bob.com",
                    password: ""
                })
            } catch (err) {
                error = err as unknown
            }

            expect(error).toEqual(expected)
            expect(axiosMock.post).not.toHaveBeenCalled()
        })

        it("should sign up successfully", async () => {
            const input: CreateUserInput = {
                email: "hib@bob.com",
                password: "@Password01"
            }
            const expected: ResponseMessage = { message: "user created" }

            jest.spyOn(axiosMock, "post").mockResolvedValue({
                data: { message: "user created" }
            })

            const actual = await user.signUp(input)

            expect(actual).toEqual(expected)
            expect(axiosMock.post).toHaveBeenCalledWith("/auth/sign-up", input)
        })
    })

    describe("POST /auth/sign-in", () => {
        it("should successfully log user in", async () => {
            const input: CreateUserInput = {
                email: "hib@bob.com",
                password: "@Password01"
            }
            jest.spyOn(axiosMock, "post").mockResolvedValueOnce({
                data: { token: "ey..." }
            })

            const actual = await user.signIn(input)

            expect(actual).toEqual({ token: "ey..." })
            expect(axiosMock.post).toHaveBeenCalledWith("/auth/sign-in", input)
        })
    })

    describe("POST /auth/api-key", () => {
        it("should successfully generate an api key", async () => {
            jest.spyOn(axiosMock, "post").mockResolvedValueOnce({
                data: { apiKey: "WM.ahxnoqwue28" }
            })

            const actual = await user.generateApiKey()

            expect(actual).toEqual({ apiKey: "WM.ahxnoqwue28" })
            expect(axiosMock.post).toHaveBeenCalledWith("/auth/api-key")
        })
    })

    describe("POST /auth/forgot-password", () => {
        it("should successfully send a forgot password request", async () => {
            const input = "bob@gmail.com"
            const expected: ResponseMessage = {
                message: "A One Time Pin has been sent to your email"
            }
            jest.spyOn(axiosMock, "post").mockResolvedValueOnce({
                data: { message: "A One Time Pin has been sent to your email" }
            })

            const actual = await user.forgotPassword(input)

            expect(actual).toEqual(expected)
            expect(axiosMock.post).toHaveBeenCalledWith(
                "/auth/forgot-password",
                input
            )
        })
    })

    describe("POST /auth/reset-password", () => {
        it("should successfully reset password", async () => {
            const input: ResetPasswordInput = {
                password: "@Password01",
                email: "johndoe@example.com",
                otp: "123456"
            }
            const expected: ResponseMessage = {
                message: "Password reset successful"
            }
            jest.spyOn(axiosMock, "post").mockResolvedValueOnce({
                data: { message: "Password reset successful" }
            })

            const actual = await user.resetPassword(input)

            expect(actual).toEqual(expected)
            expect(axiosMock.post).toHaveBeenCalledWith(
                "/auth/reset-password",
                input
            )
        })

        it("should not make request when input fails schema validation", async () => {
            const expected = [
                {
                    instancePath: "/otp",
                    schemaPath: "#/properties/otp/minLength",
                    keyword: "minLength",
                    params: { limit: 6 },
                    message: "must NOT have fewer than 6 characters"
                }
            ]

            let error
            try {
                await user.resetPassword({
                    email: "johndoe@exmaple.com",
                    password: "@Password01",
                    otp: "612"
                })
            } catch (err) {
                error = err as unknown
            }

            expect(error).toEqual(expected)
            expect(axiosMock.post).not.toHaveBeenCalled()
        })
    })
})
