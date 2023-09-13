const { Restaurant } = require("../dist/restaurant")
const { $httpClient } = require("./client")

const restaurant = new Restaurant($httpClient)

restaurant
    .getRestaurants()
    .then((res) => console.info(res))
    .catch((err) => console.error(err))
