import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest
} from "@jest/globals"
import axios from "axios"
import { User } from "../../../lib/user"
jest.mock("axios")

const axiosMock = jest.mocked(axios, { shallow: true })
let user: User

describe("User", () => {
    beforeEach(() => {
        user = new User(axiosMock)
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
                await user.createUser({
                    email: "hib@bob.com",
                    password: ""
                })
            } catch (err) {
                error = err as unknown
            }

            expect(error).toEqual(expected)
            expect(axiosMock.post).not.toHaveBeenCalled()
        })
    })
})
