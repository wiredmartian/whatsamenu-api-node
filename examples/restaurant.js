const { Restaurant } = require("../dist/restaurant")
const { $httpClient } = require("./client")

const restaurantApi = new Restaurant($httpClient)

restaurantApi
    .getRestaurants()
    .then((res) => console.info(res))
    .catch((err) => console.error(err))
