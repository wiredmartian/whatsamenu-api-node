const { Restaurant } = require("../dist")
const { $httpClient } = require("./client")
const fs = require("fs")

const restaurant = new Restaurant($httpClient)

const imagePath = "__test__/__assets__/kota.jpeg"
const buffer = fs.readFileSync(imagePath)

restaurant
    .upload(66, new Blob([buffer], { type: "image/jpeg"}))
    .then((res) => console.info(res))
    .catch((err) => console.error(err))
