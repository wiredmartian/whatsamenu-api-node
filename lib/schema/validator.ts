import Ajv from "ajv"

const MB = Math.pow(1024, 2)

const validate = <T>(schema: Record<string, string>, data: T) => {
    const validator = new Ajv({ allErrors: true }).compile(schema)

    const valid = validator(data)

    return new Promise((resolve, reject) => {
        if (valid) resolve(valid)
        reject(validator.errors)
    })
}

const formFileValid = (file: Blob) => {
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        return Promise.reject(Error("invalid image mime-type"))
    }

    if (file.size > 1 * MB) {
        return Promise.reject(Error("file too large. file must not exceed 1mb"))
    }
    return Promise.resolve()
}

export const validator = {
    /**
     * validates a Json schema and returns a rejected promise if invalid
     */
    validateJsonSchema: validate,
    /**
     * Validates file contents returns rejected promised if it fails some rules
     */
    validateFormFile: formFileValid
}
