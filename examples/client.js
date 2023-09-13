const axios = require("axios")

const $httpClient = axios.create({
    baseURL: "https://whatsamenu.core.wiredmartians.com/v1",
    timeout: 25000,
    headers: {
        "X-Auth-Token": "WM.",
        Authorization: "Bearer ey..."
    }
})

exports.$httpClient = $httpClient
