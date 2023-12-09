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

/**
 * Ensures password meets the following criteria:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 * @param password - password to validate
 */
const validatePassword = (password: string) => {
    if (password.length < 8) {
        return Promise.reject(new Error("must be at least 8 characters long"))
    }
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[-+_!@#$%^&*.,?]/.test(password)
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase) {
        return Promise.reject(
            new Error("must contain at least 1 uppercase letter")
        )
    }

    if (!hasLowerCase) {
        return Promise.reject(
            new Error("must contain at least 1 lowercase letter")
        )
    }

    if (!hasNumber) {
        return Promise.reject(new Error("must contain at least 1 number"))
    }

    if (!hasSpecialChar) {
        return Promise.reject(
            new Error(
                "must contain at least 1 special character: `-+_!@#$%^&*.,?`"
            )
        )
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
    validateFormFile: formFileValid,

    validatePassword: validatePassword
}
