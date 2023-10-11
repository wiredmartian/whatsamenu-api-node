const axios = require("axios")

const $httpClient = axios.create({
    baseURL: "http://127.0.0.1:9200/v1",
    timeout: 25000,
    headers: {
        "X-API-Key": process.env.API_KEY,
    }
})

exports.$httpClient = $httpClient
