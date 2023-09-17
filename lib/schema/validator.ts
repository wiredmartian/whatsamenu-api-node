import Ajv from "ajv"

export const validator = <T>(schema: Record<string, string>, data: T) => {
    const validator = new Ajv({ allErrors: true }).compile(schema)

    const valid = validator(data)

    return new Promise((resolve, reject) => {
        if (valid) resolve(valid)
        reject(validator.errors)
    })
}
