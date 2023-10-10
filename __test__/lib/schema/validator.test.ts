import { describe, it, expect } from "@jest/globals"
import fs from "fs"
import { validator } from "../../../lib/schema"

describe("validateFormFile", () => {
    it("should resolve promise when the image is valid", async () => {
        const imagePath = "__test__/__assets__/kota.jpeg"
        const buffer = fs.readFileSync(imagePath)
        const file = createFile(buffer, "image/jpeg")
        expect(validator.validateFormFile(file)).resolves.not.toThrow()
    })

    it("should reject promise when the image is too large", async () => {
        let error: Error | null = null
        try {
            const buffer = Buffer.alloc(Math.pow(1024, 2) + 10) // allocate 1MB + 10 bytes
            const file = createFile(buffer, "image/jpeg")
            await validator.validateFormFile(file)
        } catch (err) {
            error = err as unknown as Error
        }
        expect(error?.message).toBe("file too large. file must not exceed 1mb")
    })

    it("should reject promise when the image has unknown mime type", async () => {
        let error: Error | null = null
        try {
            const buffer = Buffer.alloc(Math.pow(1024, 2))
            const file = createFile(buffer, "image/gif")
            await validator.validateFormFile(file)
        } catch (err) {
            error = err as unknown as Error
        }
        expect(error?.message).toBe("invalid image mime-type")
    })
})

function createFile(buffer: Buffer, type: string) {
    return new Blob([buffer], { type })
}
